const fs = require('fs')
const express = require('express');

const app = express();

app.use(express.json()); //middleware

// ${__dirname} =: arquivo raiz
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

// GET METHOD
app.get('/api/v1/tours', (req, res) =>{
    res.status(200).json({
        status: 'success',
        results: tours.length, // números de objetos enviados pelo array
        data: {
            tours // tours: tours
        }
    })
})

// GET METHOD WITH URL PARAMETERS
// :parament
// :optionalParament?
app.get('/api/v1/tours/:id', (req, res) =>{
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
})

// POST METHOD
app.post('/api/v1/tours', (req, res) => {
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
})

// PATH METHOD
app.patch('/api/v1/tours/:id', (req, res) =>{
    
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

})

// DELETE METHOD
app.delete('/api/v1/tours/:id', (req, res) =>{
    
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

})

const port = 3000;
app.listen(port, ()=>{
    console.log(`App running on port ${port}...`)
});

//STATUS
// 200: OK
// 201: Created
// 204: No Content
// 404: Not found