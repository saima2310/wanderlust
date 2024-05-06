const express = require("express");
const { route } = require("./listing");
const router = express.Router();
const User = require("../models/user");
const user = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

// signup
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(userController.signup);

// router.get("/signup", userController.renderSignupForm);
// router.post("/signup", userController.signup);

// login
router
  .route("/login")
  .get(userController.renderLoginpForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// router.get("/login", userController.renderLoginpForm);

// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );

// logout
router.get("/logout", userController.logout);

module.exports = router;
