const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        maxlength: 1000,
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000,
    },
    platform: {
        type: String,
        required: true,
    },
    languages: {
        type: [String],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    overallRating: {
        type: Number,
        default: 0,
    },
    ratings: [{
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    }, ],
    mainImage: {
        type: String,
        default: () =>
            "https://static.hertz-audio.com/media/2021/05/no-product-image.png",
        required: false,
    },
    secondaryImages: [{
        type: String,
        maxItems: 2,
    }, ],
    video: {
        type: String,
    },
});

module.exports = mongoose.model("Item", itemSchema);