const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchasyncerror");
const User = require("../modals/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const cloudinary = require("cloudinary");
const crypto = require("crypto");


// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
  
    const { name, email, password } = req.body;
  
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
  
    sendToken(user, 201, res);
  });


//user login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body
    //checking if user has given both email and password
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter the Email or Password", 400))
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }
    sendToken(user, 200, res);

});

//logout user
exports.logout = catchAsyncErrors(async (req, res, next) => {


    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "logout successful"
    })
})

//forgot password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHandler("user not found", 404))
    }

    //get reset password token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your Password reset Token is :- \n\n ${resetPasswordUrl} \n\n If You Have Not Requested This Email Then Please Ignore It.`;
    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email Sent to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))
    }
});


//reset password

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.param.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("reset password token is not valid and has been expired", 404))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("reset password token is not valid and has been expired", 404))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();


    sendToken(user, 200, res);


});


//get user details
exports.getUerDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});


// update User profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    };

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
    
        const imageId = user.avatar.public_id;
    
        await cloudinary.v2.uploader.destroy(imageId);
    
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
    
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

   res.status(200).json({
    success:true
   })
});


//get all users (admin)

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    })
})


//get single users admin

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exists with id : ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user,
    })
})


// update User role  --admin
exports.updateProfileRole = catchAsyncErrors(async (req, res, next) => {
    
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    };

    //we will cloudinary later

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

   res.status(200).json({
    success:true,
   })
});

// delete User profile --admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    
    const user = await User.findById(req.params.id);

    //we will remove cloudinary later

    if(!user){
        return next(new ErrorHandler(`User does not exists with id : ${req.params.id}`))

    }

    await user.remove();

   res.status(200).json({
    success:true,
    message:`User Delete SuccesFully`
   })
});