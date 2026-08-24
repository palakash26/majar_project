const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get(WrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        WrapAsync(listingController.createListing)
    );

// Wishlist / Like toggle route
router.post("/:id/like", WrapAsync(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: "You must be logged in to save stays to your wishlist!" });
    }
    let { id } = req.params;
    let user = await User.findById(req.user._id);
    if (!user.wishlist) {
        user.wishlist = [];
    }
    let wishlistStrings = user.wishlist.map(w => w.toString());
    let index = wishlistStrings.indexOf(id.toString());
    let liked = false;
    if (index === -1) {
        user.wishlist.push(id);
        liked = true;
    } else {
        user.wishlist.splice(index, 1);
        liked = false;
    }
    await user.save();
    res.json({ success: true, liked, wishlistCount: user.wishlist.length });
}));

// new Router
router.get("/new", isLoggedIn, listingController.renderNewForm)



router
    .route("/:id")
    .get(WrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner,   upload.single("listing[image]"), validateListing, WrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, WrapAsync(listingController.destoryListing));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, WrapAsync(listingController.renderEditForm));


// home route
// router.post("/:id", WrapAsync(async (req, res) => {
//     let { id } = req.params;
//     res.redirect(`/listings`);
// }));

module.exports = router;