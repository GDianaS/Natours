const fs = require('fs')
const express = require('express');
const morgan = require('morgan'); //HTTP request logger middleware
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
//console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());

// STATICS FILES
// quando o navegador abre uma página que ele não acha a rota, ele olha para a pasta public em seguida
// localhost/public/overview.html
app.use(express.static(`${__dirname}/public`));

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

// ERROR HANDLING: UNHANDLED ROUTES
// se chegou até aqui, quer dizer que nenhuma das rotas foi usada
app.all('*', (req, res, next) => {
    // const error = new Error(`Can't find ${req.originalUrl} on this server`);
    // error.status = 'fail';
    // error.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;