const fs = require('fs');

// ${__dirname} =: arquivo raiz atual
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


exports.checkID = (req, res, next, val) => {
    // req: request
// res: response
// next: next function
// val: hold the value of the param, in this case "id"
    console.log(`Tour id is: ${val}`);
    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
};

exports.checkBody = (req, res, next) =>{
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            status:'fail',
            message: 'Missing name or price'
        });
    }
    next();
};

// ROUTES HANDLERS
// GET METHOD
exports.getAllTours = (req, res) =>{
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length, // números de objetos enviados pelo array
        data: {
            tours // tours: tours
        }
    });
};

// GET METHOD WITH URL PARAMETERS
// :parament
// :optionalParament?
exports.getTour = (req, res) =>{
    //console.log(req.params)
    
    const id = req.params.id * 1; // string -> number
    const tour = tours.find( element => element.id == id);

    res.status(200).json({
        status: 'success',
        data:{
            tour
        }
    });
}

// POST METHOD
exports.createTour = (req, res) => {
    //console.log(req.body);

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id : newId}, req.body);

    tours.push(newTour) // adicionando um novo tour no array tours

    // atualizar o arquivo com os tours
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, 
        JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour : newTour
                }
            });
        }
    );
}

// PATH METHOD
exports.updateTour = (req, res) =>{
    res.status(200).json({
        status : 'success',
        data:{
            tour: '<Updated tour here...>'
        }
    });

}

// DELETE METHOD
exports.deleteTour = (req, res) =>{
    res.status(204).json({
        status : 'success',
        data: null
    });

};