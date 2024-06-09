const mongo = require("mongoose");
const { descriptors, places } = require('./seedHelpers');
const cities = require("./cities");
const Campground = require("../models/campground");
const { default: mongoose } = require("mongoose");
const category = require("./Category");

mongo.connect('mongodb://127.0.0.1:27017/YelpCamp')
    .then(() => {
        console.log("Database active");
    }
    ).catch((e) => {
        console.log("check database error", e);
    });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log("connected");
})

const title = (arr) => arr[Math.floor(Math.random() * arr.length)];


const seedingDB = async () => {
    try {
        await Campground.deleteMany({});
    } catch (error) {
        console.log("fisrt await err");
    }
    const random = Math.floor(Math.random() * 1000);

    for (let i = 0; i < 10; i++) {
        const camp = new Campground({
            location: `${cities[random].city} ,${cities[random].state}`,
            title: `${title(descriptors)} ${title(places)}`,
            price: `${Math.ceil(Math.random() * 599)}`,
            // imageUrl: `https://source.unsplash.com/random/?${category[Math.floor(Math.random() * category.length)]},4k`,
            images: [{
                url: 'https://res.cloudinary.com/dfrwutku3/image/upload/v1712079914/YelpCamp/q5mb9vugylvzvhhamavv.png',
                filename: 'YelpCamp/q5mb9vugylvzvhhamavv',
            }],
            // imageUrl: "nothing:here",
            description: "Lorem ipsumsequuntur neque suscipit nam recusandae vel quibusdam quo, hic esse eum ipsam.",
            author: "6527b5247297c1372d8cd162"
        })
        try {
            await camp.save();
        } catch (error) {
            console.log("second await err");
        }
    }
}

seedingDB().then(() => {
    mongo.connection.close().then(() => {
        console.log("sab clear");
    }).catch((e) => {
        console.log("yeh error tha");
    });
});
