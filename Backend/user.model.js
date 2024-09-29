const Item = require("./item.model");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: false,
        default: "pfp.jpg",
    },
    library: {
        type: [String],
        required: false,
    },
    wishlist: {
        type: [String],
        required: false,
    },
    customLists: {
        type: [String],
        required: false,
    },
    carrinho: {
        type: [String],
        required: false,
    },
    followingLists: {
        type: [String],
        required: false,
    },
    followerLists: {
        type: [String],
        required: false,
    },
});

module.exports = mongoose.model("User", userSchema);