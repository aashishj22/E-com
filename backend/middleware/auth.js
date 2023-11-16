const ErrorHandler = require("../utils/errorHandler");
const catchasyncerror = require("./catchasyncerror");
const jwt = require("jsonwebtoken");
const User = require("../modals/userModel")
exports.isaAuthenticateUser = catchasyncerror(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please Login to access these Resources",401))
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

   req.user =  await User.findById(decodedData.id);
   next();

})

exports.authorizeRole =(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next( new ErrorHandler(`Role : ${req.user.role} is not allowed to acces these resouces`,403));
        }
        next();
    }

}

