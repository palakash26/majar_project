const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReviews, isLoggedIn,isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// review 
// post  reviews route
router.post("/", isLoggedIn, validateReviews, WrapAsync(reviewController.createReview));

// delete reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, WrapAsync(reviewController.destroyReview));


module.exports = router;