require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";


const User = require("../models/user.js");

main().then(async () => {
    console.log("Connected to DB");
    await initDB();
    mongoose.disconnect();
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    
    let adminUser = await User.findOne({ username: "admin" });
    if (!adminUser) {
        adminUser = new User({ email: "admin@gmail.com", username: "admin" });
        adminUser = await User.register(adminUser, "admin123");
    }

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: adminUser._id,
        geometry: {
            type: "Point",
            coordinates: [0, 0]
        }
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};