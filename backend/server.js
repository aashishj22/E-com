const app = require("./app")
const dotenv = require("dotenv")
const connectDatabase= require("./config/databse")
const cloudinary = require("cloudinary");


//handeliing uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`)
    console.log(`Shutting down due to unhandled error / Promise rejection`);
    process.exit(1);
})

//config
dotenv.config({path:"backend/config/config.env"})

//config database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });





const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on http://localhost:${process.env.PORT}`)

})





//unhanndled promise rejection
process.on("unhandledRejection",err=>{
    console.log(`Error : ${err.message}`)
    console.log(`Shutting down due to unhandled error / Promise rejection`);
    server.close(()=>{
        process.exit(1);
    });
})