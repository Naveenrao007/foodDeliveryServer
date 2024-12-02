const mongoose = require("mongoose");


const cardSchema = new mongoose.Schema({
    cardHolderName: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: String,
        required: true,
    },
    cvc: {
        type: Number,
        required: true,
    },
    isPrimary: {
        type: Boolean,
        default: false,
    },
});


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,

    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    country: {
        type: String,
    },
    cards: [cardSchema],
}, {
    timestamps: true,
});


const User = mongoose.model('User', userSchema);
module.exports = User;
