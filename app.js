const fs = require('fs')
const express = require('express');
const morgan = require('morgan'); //HTTP request logger middleware

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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

// middlewares anteriores serão executados, e só depois os middlewares especificos (tourRoutes,userRoutes) serão executados 
// ROUTES
app.use('/api/v1/tours', tourRouter); 
app.use('/api/v1/users', userRouter); 

module.exports = app;