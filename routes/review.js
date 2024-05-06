const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review");
const {
  validateReview,
  isloggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// reviews
// post route
router.post("/", isloggedIn, validateReview, reviewController.createReview);

// delete review route
router.delete(
  "/:reviewId",
  isloggedIn,
  isReviewAuthor,
  reviewController.destroyReview
);

module.exports = router;
