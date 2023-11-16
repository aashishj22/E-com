const express = require("express");
const dotenv = require("dotenv")
const errorMiddleware = require("./middleware/error");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

//config
dotenv.config({ path: "backend/config/config.env" })


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//routes  imports
const products = require("./routes/ProductRoutes");
const user = require("./routes/userRoutes");
const order = require("./routes/orderRoutes");
const payment = require("./routes/paymentRoute");

app.use("/api/v1", products);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

//middleware for the error
app.use(errorMiddleware);

//payment

module.exports = app;
