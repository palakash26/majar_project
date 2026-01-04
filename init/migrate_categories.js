const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
require("dotenv").config();

const dbUrl = process.env.ATLASDB_URL;

async function migrate() {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB for migration");

    const result = await Listing.updateMany(
        { category: { $exists: false } },
        { $set: { category: "Trending" } }
    );

    console.log(`Updated ${result.modifiedCount} listings with default category 'Trending'`);

    // Also update any listings where category might be null or empty
    const result2 = await Listing.updateMany(
        { category: null },
        { $set: { category: "Trending" } }
    );
    console.log(`Updated ${result2.modifiedCount} listings where category was null`);

    await mongoose.disconnect();
    console.log("Disconnected from DB");
}

migrate().catch(err => console.error(err));
