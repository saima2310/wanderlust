const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    try {
      let newReview = new Review(req.body.review);
      newReview.author = req.user._id;
      listing.reviews.push(newReview);
      console.log(newReview);
      await newReview.save();
      await listing.save();
  
      console.log("new review saved");
      req.flash("success", "new review created!");
  
      res.redirect(`/listings/${listing._id}`);
    } catch (err) {
      next(err);
    }
  }

  module.exports.destroyReview = async (req, res, next) => {
    try {
      let { id, reviewId } = req.params;
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success", "Review Deleted!");
  
      res.redirect(`/listings/${id}`);
    } catch (err) {
      next(err);
    }
  }