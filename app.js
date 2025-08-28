const fs = require('fs')
const express = require('express');
const morgan = require('morgan'); //HTTP request logger middleware

const app = express();

// MIDDLEWARES
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from the middleware!');
    next(); //chama a próxima função
});


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


// ${__dirname} =: arquivo raiz
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

// ROUTES HANDLERS
// GET METHOD
const getAllTours = (req, res) =>{
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length, // números de objetos enviados pelo array
        data: {
            tours // tours: tours
        }
    })
}

// GET METHOD WITH URL PARAMETERS
// :parament
// :optionalParament?
const getTour = (req, res) =>{
    //console.log(req.params)
    
    const id = req.params.id * 1; // string -> number
    const tour = tours.find( element => element.id == id)

    
    if(!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    

    res.status(200).json({
        status: 'success',
        data:{
            tour
        }
    })
}

// POST METHOD
const createTour = (req, res) => {
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
const updateTour = (req, res) =>{
    
    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
        status : 'success',
        data:{
            tour: '<Updated tour here...>'
        }
    })

}

// DELETE METHOD
const deleteTour = (req, res) =>{
    
    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(204).json({
        status : 'success',
        data: null
    })

}

// ROUTES

//app.get('/api/v1/tours', getAllTours)
//app.post('/api/v1/tours', createTour)
//app.get('/api/v1/tours/:id', getTour)
//app.patch('/api/v1/tours/:id', updateTour)
//app.delete('/api/v1/tours/:id', deleteTour)

app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);


// START THE SERVER
const port = 3000;
app.listen(port, ()=>{
    console.log(`App running on port ${port}...`)
});

//STATUS
// 200: OK
// 201: Created
// 204: No Content
// 404: Not found