//ERROR HANDLING MIDDLEWARE

const AppError = require('./../utils/appError');

const handleCastErrorDB = error => {
    console.log('Handle Cast Error Function');
    const message = `Invalid ${error.path}: ${error.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    // mensagem de erro de chave duplicada vem em err.message, e o valor duplicado em err.keyValue.
    // se err.keyValue existir tranforme ele em uma string(stringify), caso não use o padrão duplicated field
    const value = err.keyValue ? JSON.stringify(err.keyValue) : 'duplicated field';
    console.log(value);
    const message = `Duplicate field value: ${value}. Please use another value.`;
    return new AppError(message, 400);

}

handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
}


const sendErrorProd = (err, res) => {
    // isOperational is defined in appError.js
    // Operational, trusted error: send message to client.
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

    // Programming or other unknown error: don't leak error details to the client.
    } else {
        // 1) Log error
        console.error('ERROR 💥', 'err');

        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }

}

module.exports = (err, req, res, next) =>{

    //console.log(error.stack);
    //console.log(error);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){

        sendErrorDev(err, res);

    } else if(process.env.NODE_ENV === 'production'){
   
        //let error = { ...err }; --> está dando error ao criar uma cópia
        let error = Object.assign(err);
        console.log(error);

        if(error.name === 'CastError') error = handleCastErrorDB(error); 
        if(error.code === 11000) error = handleDuplicateFieldsDB(error);
        if(error.name == 'ValidationError') error = handleValidationErrorDB(error);
       
        sendErrorProd(error, res);

    }

    
}