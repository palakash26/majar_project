require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(async () => {
    console.log("Connected to DB");
    await initDB();
    mongoose.disconnect();
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "65a6bfd85e87ef780244c2ca",
        geometry: {
            type: "Point",
            coordinates: [0, 0]
        }
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}