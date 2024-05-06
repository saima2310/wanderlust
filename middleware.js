const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const expressError = require("./utils/expressError");

// validate listing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

// validate review
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

// login check
module.exports.isloggedIn = (req, res, next) => {
  console.log(req.path, " ", req.originalUrl);
  if (!req.isAuthenticated()) {
    // / redirect URL save
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to Do Further Activities!");
    return res.redirect("/login");
  }
  next();
};

// save url
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// authorization
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You Are Not the owner of this listing!!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// authorization review
module.exports.isReviewAuthor = async (req, res, next) => {
  let {id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You did not create this review!!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
