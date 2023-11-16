const ErrorHandler = require ("../utils/errorHandler");

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    //wrong mongo db error
    if(err.name=="CasteError"){
        const message = `Resouce not found . Invalid : ${err.path}`;
        err = new ErrorHandler(message,404)
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        let message = "Duplicate Entry";
        if (err.keyPattern) {
            const keys = Object.keys(err.keyPattern);
            message = `Duplicate ${keys.join(", ")} Entered`;
        }
        err = new ErrorHandler(message, 404);
    }

    
    // JWT error handling
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid token";
        err = new ErrorHandler(message, 401); 
    } else if (err.name === "TokenExpiredError") {
        const message = "Token has expired";
        err = new ErrorHandler(message, 401); 
    }


    

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
}