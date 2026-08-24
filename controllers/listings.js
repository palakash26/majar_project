const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    try {
        let { category, q, filter } = req.query;
        console.log("Index Route - Category:", category, "Search Query:", q, "Filter:", filter);
        let allListings;
        let filterCategory = category || "All";

        if (filter === "mylistings" && req.user) {
            allListings = await Listing.find({ owner: req.user._id }).populate("reviews");
            filterCategory = "My Created Listings";
        } else if (filter === "liked" && req.user) {
            let user = await User.findById(req.user._id);
            allListings = await Listing.find({ _id: { $in: (user && user.wishlist) ? user.wishlist : [] } }).populate("reviews");
            filterCategory = "My Saved Stays";
        } else if (category && category !== "undefined" && category !== "All") {
            allListings = await Listing.find({ category: category }).populate("reviews");
        } else if (q) {
            allListings = await Listing.find({
                $or: [
                    { title: { $regex: q, $options: "i" } },
                    { category: { $regex: q, $options: "i" } },
                    { location: { $regex: q, $options: "i" } }
                ]
            }).populate("reviews");
            filterCategory = `Search: ${q}`;
        } else {
            allListings = await Listing.find({}).populate("reviews");
            filterCategory = "All";
        }
        console.log("Listings found:", allListings.length);
        res.render("listings/index.ejs", { allListings, category: filterCategory });
    } catch (err) {
        console.error("Error in listings index:", err);
        req.flash("error", "Failed to load listings. Please try again.");
        res.redirect("/listings");
    }
};

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: { path: "author", },
    })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {

    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();

    // console.log(response.body.features[0].geometry);
    // res.send("done!");



    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// module.exports.updateListing = async (req, res) => {
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     req.flash("success", "New Listing Upadated!");
//     res.redirect(`/listings/${id}`);
//     console.log("hello");
// };


module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        let listing = await Listing.findById(id);

        if (req.body.listing) {
            Object.assign(listing, req.body.listing);
        }

        if (req.body.listing && (req.body.listing.location || req.body.listing.country)) {
            try {
                let response = await geocodingClient.forwardGeocode({
                    query: `${req.body.listing.location}, ${req.body.listing.country}`,
                    limit: 1
                }).send();

                if (response.body.features && response.body.features.length) {
                    listing.geometry = response.body.features[0].geometry;
                }
            } catch (geoErr) {
                console.error("Mapbox geocoding error on update:", geoErr);
            }
        }

        if (typeof req.file !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
        }

        await listing.save();
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error updating listing:", error);
        req.flash("error", "Error updating listing");
        res.redirect(`/listings/${id}`);
    }
};


module.exports.destoryListing = async (req, res) => {
    let { id } = req.params;
    const deteleListing = await Listing.findByIdAndDelete(id);
    console.log(deteleListing);
    req.flash("success", " Listing Delete successfully!");
    res.redirect("/listings");
};