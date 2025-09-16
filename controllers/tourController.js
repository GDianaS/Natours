const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

//ALIAS
exports.aliasTopTours = (req, res, next)=>{
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

// ROUTES HANDLERS
// GET METHOD
exports.getAllTours = catchAsync(async (req, res, next) =>{
        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data:{
                tours
            }
            
        });
    
});

// GET METHOD WITH URL PARAMETERS
// :parament
// :optionalParament?
exports.getTour = catchAsync(async (req, res, next) =>{
        // Tour.findOne({_id: req.params.id}) 
        const tour = await Tour.findById(req.params.id); // id vem da url

        if(!tour){
            // consulta retornar um null quando não achar um tour com o id
            // return garante que a função termine nele
            return next(new AppError('No tour found with that ID', '404'))
        }

        res.status(200).json({
            status:'success',
            data: {
                tour
            }
        });

});

// POST METHOD
exports.createTour = catchAsync(async (req, res, next) => {

    // req.body: data that come from the body request
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });

    // try{
    // [...]
    // } catch(err){
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     });

    // }
});

// PATH METHOD
exports.updateTour = catchAsync(async (req, res, next) =>{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true // validators in model are run before update
        })

        if(!tour){
            return next(new AppError('No tour found with that ID', '404'))
        }

        res.status(200).json({
        status : 'success',
        data:{
            tour //tour: tour 
            }
        });
});

// DELETE METHOD
exports.deleteTour = catchAsync(async (req, res, next) =>{
        const tour = await Tour.findByIdAndDelete(req.params.id);

        if(!tour){
            return next(new AppError('No tour found with that ID', '404'))
        }

        res.status(204).json({
            status : 'success',
            data: null
        });
});


//PIPELINE DE AGREGAÇÃO
// Cada etapa ($stage) pega os documentos, transforma e passa para a próxima
exports.getTourStats = catchAsync(async(req, res) => {
        const stats = await Tour.aggregate([
            {
            // 1) Filtrar tours com média de avaliação >= 4.5
            $match: {ratingAverage: {$gte: 4.5}}
            },
            {
            // 2) Agrupar por nível de dificuldade
            $group: {
                _id: { $toUpper : '$difficulty'}, // null : one big group
                avgRating: { $avg: '$ratingAverage' },
                numTours: {$sum: 1}, // ++1
                numRatings: {$sum: '$ratingQuantity'},
                avgPrice: { $avg: '$price'},
                minPrice: { $min: '$price'},
                maxPrice: { $max: '$price'},
                }
            },
            {
            // 3) Ordenar os grupos pelo preço médio (crescente)
                $sort: { avgPrice: 1 } // names from the group
            }
            // {
            //  $match: {_id: {$ne: 'EASY'}}
            //}
    
        ]);

        res.status(200).json({
        status : 'success',
        data:{
            stats 
            }
        });

});

exports.getMonthyPlan = catchAsync(async (req, res, next) => {

        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
            // 1) "Explodir" o array de datas (um doc para cada data)
                $unwind: '$startDates'
            },
            {
            // 2) Filtrar apenas as datas dentro do ano especificado
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`), // primeiro dia do ano
                        $lte: new Date(`${year}-12-31`), // último dia do ano
                    }
                }
            },
            {
            // 3) Agrupar por mês de início
            //    contar quantos tours começam naquele mês
            //    e criar lista com os nomes dos tours
                $group: {
                    // qtd de tour por mês
                    _id: { $month: '$startDates'},
                    numTourStarts: {$sum: 1},
                    tours: { $push: '$name' } //array
                }
            },
            {
            // 4) Criar um campo "month" copiando o valor de _id
                $addFields: { month: '$_id'}
            },
            {
            // 5) Remover o campo _id da saída final
                $project: {
                    _id: 0, // 0: desaparece, 1: aparece
                }
            },
            {
            // 6) Ordenar do mês mais movimentado para o menos
                $sort: {numTourStarts: -1}
            },
            {
            // 7) Mostrar apenas os 12 primeiros resultados
                $limit: 12
            }
        ]);

        res.status(200).json({
        status : 'success',
        data:{
            plan 
            }
        });
        
});