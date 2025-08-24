const fs = require('fs')
const express = require('express');

const app = express();

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

// POST METHOD
app.post('/api/v1/tours')

const port = 3000;
app.listen(port, ()=>{
    console.log(`App running on port ${port}...`)
});

