
const Joi = require("joi");
module.exports.campgroundJoiSchema = Joi.object({
    Campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        // imageUrl: Joi.string().required(),
        desc: Joi.string().required()
    }).required()
});
module.exports.reviewJoiSchema = Joi.object({
    review: Joi.object({
        review: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()
    }).required()
})