const mongo = require('mongoose');
const Review = require("./review.js")
const Schema = mongo.Schema;


const imageSchema = new Schema({
    url: String,
    filename: String
})
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace("/upload", "/upload/w_150");
})

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    images: [imageSchema],
    description: {
        type: String
    },
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
    // console.log(doc);
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
const Campground = new mongo.model('Campground', campgroundSchema);

module.exports = Campground;
