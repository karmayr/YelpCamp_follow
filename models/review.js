const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reviewSchema = new Schema({
    review: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})
module.exports = model("Review", reviewSchema);