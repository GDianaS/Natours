//ERROR HANDLING MIDDLEWARE

const sendErrorDev = (err, res) => {
    res.status(error.statusCode).json({
            status: error.status,
            error: error,
            message: error.message,
            stack: error.stack
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

module.exports = (error, req, res, next) =>{

    //console.log(error.stack);
    //console.log(error);

    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if(process.env.NODE_ENV === 'development'){

        sendErrorDev(error, res);

    } else if(process.env.NODE_ENV === 'production'){
       
        sendErrorProd(error, res);

    }

    
}