//const fs = require('fs');
const Tour = require('./../models/tourModel');

// ${__dirname} =: arquivo raiz atual
//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.checkID = (req, res, next, val) => {
// // req: request
// // res: response
// // next: next function
// // val: hold the value of the param, in this case "id"
//     console.log(`Tour id is: ${val}`);
//     if(req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }
//     next();
// };

// exports.checkBody = (req, res, next) =>{
//     if(!req.body.name || !req.body.price){
//         return res.status(400).json({
//             status:'fail',
//             message: 'Missing name or price'
//         });
//     }
//     next();
// };

// ROUTES HANDLERS
// GET METHOD
exports.getAllTours = async (req, res) =>{
    try{

        //console.log(req.query); // vem do url

        // PESQUISAS/CONSULTAS/FILTER/ QUERIES:

        // A)
        // const tours = await Tour.find({
        //     duration: 5,
        //     difficulty: 'easy'
        // });

        // B)
        //const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

        //const tours = await Tour.find(req.query) // 127.0.1:3000/api/v1/tours?duration=5&difficulty=easy

        //const tours = await Tour.find(); // todos os documentos

        const queryObj = {...req.query}; //cópia
        //mesma coisa que:
        // const queryObj = {
        //     duration: req.query.duration,
        //     difficulty: req.query.difficulty
        // };

        // deletar campos não desejados
        const excludedFields= ['page','sort','limit','fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        //console.log(req.query,queryObj);
        //const tours = await Tour.find(queryObj);

        //ADVANCED FILTERING
        ///api/v1/tours?price[gte]=500&duration[lt]=10
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        //console.log(JSON.parse(queryStr));

        let query = Tour.find(JSON.parse(queryStr));

        // SORTING
        if(req.query.sort){
            // MONGO: sort('price ratingAverage');
            // URL: sort=price,ratingAverage;
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else{
            // default
            query = query.sort('-createdAt');
        }


        const tours = await query;

        
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
            runValidators: true
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