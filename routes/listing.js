const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// index & create
router
  .route("/")
  .get(listingController.index)
  .post(
    upload.single("listing[image]"),
    validateListing,
    listingController.createLListing
  );

//New Route
router.get("/new", isloggedIn, listingController.renderNewForm);

//show, update & delete
router
  .route("/:id")
  .get(listingController.showListing)
  .put(
    isloggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    listingController.updateListing
  )
  .delete(isloggedIn, isOwner, listingController.destroyListing);

// Edit Route
router.get("/:id/edit", isloggedIn, isOwner, listingController.renderEditForm);

//Index Route
// router.get("/", listingController.index);

//New Route
// router.get("/new", isloggedIn, listingController.renderNewForm);

//Show Route
// router.get("/:id", listingController.showListing);

//Create Route
// router.post("/", validateListing, listingController.createLListing);

//Edit Route
// router.get("/:id/edit", isloggedIn, isOwner, listingController.renderEditForm);

//Update Route
// router.put(
//   "/:id",
//   isloggedIn,
//   isOwner,
//   validateListing,
//   listingController.updateListing
// );

//Delete Route
// router.delete("/:id", isloggedIn, isOwner, listingController.destroyListing);

module.exports = router;
