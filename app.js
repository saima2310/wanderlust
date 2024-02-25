// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const Listing = require("./models/listing");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");

// main()
//   .then(() => {
//     console.log("connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
// }

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname, 'public')))

// app.get("/", (req, res) => {
//   res.send("hi, i am root");
// });

// //Index Route
// app.get("/listings", async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// });

// // new route
// app.get("/listings/new", (req, res) => {
//   res.render("listings/new.ejs");
// });

// // show route
// app.get("/listings/:id", async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id);
//   res.render("listings/show.ejs", { listing });
// });

// // create route
// app.post("/listings", async (req, res) => {
//   // let { title, description, image, price, country, location } = req.body;
//   let listing = req.body.listing;
//   const newListing = new Listing(listing);
//   await newListing.save();
//   res.redirect("/listings");
// });

// // edit route
// app.get("/listings/:id/edit", async (req, res) => {
//   // res.send('working')
//   const { id } = req.params;
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs", { listing });
// });

// // update route
// app.put("/listings/:id", async (req, res) => {
//   const { id } = req.params;
//   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   console.log(listing);
//   res.redirect(`/listings/${id}`);
// });

// // delete route

// app.delete("/listings/:id", async (req, res) => {
//   const { id } = req.params;
//   let listing = await Listing.findByIdAndDelete(id);
//   console.log(listing);
//   res.redirect(`/listings`);
// });

// // app.get("/testListing", async (req, res) => {
// //   let sampleListing = new Listing({
// //     title: "My New Villa",
// //     description: "by new beach",
// //     price: 2300,
// //     location: "Fatehpur, Uttarpradesh",
// //     country: "india",
// //   });
// //   await sampleListing.save();
// //   console.log("data is saved");
// //   res.send("successful testing");
// // });

// app.listen(8080, () => {
//   console.log("app is listening");
// });

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//Index Route
app.get("/listings",  wrapAsync( async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id",  wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

//Create Route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Edit Route
app.get("/listings/:id/edit", wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id",  wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",  wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 501, message=' something went wrong' } = err;
  res.status(statusCode).send(message);
  // res.send('error')
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
