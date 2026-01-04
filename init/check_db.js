const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
require("dotenv").config();

const dbUrl = process.env.ATLASDB_URL;

async function check() {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB:", mongoose.connection.name);

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    console.log("Model Collection Name:", Listing.collection.name);

    const listings = await Listing.find({}).limit(5);
    console.log("Found " + listings.length + " listings");
    listings.forEach(l => {
        console.log(`ID: ${l._id}, Title: ${l.title}, Category: ${l.category}`);
    });

    await mongoose.disconnect();
}

check().catch(err => console.error(err));
