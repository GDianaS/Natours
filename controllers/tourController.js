const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

//ALIAS
exports.aliasTopTours = (req, res, next)=>{
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

// ROUTES HANDLERS
// GET METHOD
exports.getAllTours = async (req, res) =>{
    try{
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

    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
    
};

// GET METHOD WITH URL PARAMETERS
// :parament
// :optionalParament?
exports.getTour = async (req, res) =>{
    try{
        // Tour.findOne({_id: req.params.id}) 

        const tour = await Tour.findById(req.params.id); // id vem da url

        res.status(200).json({
            status:'success',
            data: {
                tour
            }
        });

    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

// POST METHOD
exports.createTour = async (req, res) => {

    try{
    // req.body: data that come from the body request
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });

    }
};

// PATH METHOD
exports.updateTour = async (req, res) =>{

    try {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true // validators in model are run before update
        })

        res.status(200).json({
        status : 'success',
        data:{
            tour //tour: tour 
            }
        });
     
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
}

// DELETE METHOD
exports.deleteTour = async (req, res) =>{
    try {

        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status : 'success',
            data: null
        });
        
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
    

};


//PIPELINE DE AGREGAÇÃO
// Cada etapa ($stage) pega os documentos, transforma e passa para a próxima
exports.getTourStats = async(req, res) => {
    try {
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

        
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
};

exports.getMonthyPlan = async (req, res) => {
    try {
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
        
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }

};