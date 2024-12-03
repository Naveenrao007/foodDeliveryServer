const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const cardSchema = new mongoose.Schema({
    cardId: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4,
    },
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
const addressSchema = new mongoose.Schema({
    addId: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    fullAddress: {
        type: String,
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
    addresses: [addressSchema]
}, {
    timestamps: true,
});


const User = mongoose.model('User', userSchema);
module.exports = User;
