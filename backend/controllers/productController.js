const Product = require("../modals/productmodals");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchasyncerror");
const ApiFeatures = require("../utils/apiFeatures");


//create products -- admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})


// Get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 80;
    const productsCount = await Product.countDocuments();
  
    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter();
  
    let products = await apiFeature.query;
  
    let filteredProductsCount = products.length;
  
    apiFeature.pagination(resultPerPage);
  
    products = await apiFeature.query;
  
    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount,
    });
  });

//get a single product
exports.getSingleProducts = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })


});

//update the product -- admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });
    res.status(200).json({
        success: true,
        product
    })

})

//delete the product
exports.deletePrroduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message: "Product Deleted SuccesFully"
    })
})

// Create New Review or Update the Review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});


//get all reviews

exports.getAllReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
})

// Delete a review for a product
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    // Extract the productId and reviewId from the query parameters
    const { productId, id } = req.query;

    // Find the product by its unique ID
    const product = await Product.findById(productId);
    
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Filter the reviews to exclude the one with the specified id
    const updatedReviews = product.reviews.filter(rev => rev._id.toString() !== id.toString());

    // Calculate the new average rating and the number of reviews
    let avg = 0;

    updatedReviews.forEach(rev => {
        avg += rev.rating;
    });

    const ratings = avg / updatedReviews.length;
    const numOfReviews = updatedReviews.length;

    // Update the product with the modified reviews, ratings, and numOfReviews
    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { reviews: updatedReviews, ratings, numOfReviews },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        product: updatedProduct,
    });
});
