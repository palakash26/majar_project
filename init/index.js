const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,owner:"65a6bfd85e87ef780244c2ca"
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();