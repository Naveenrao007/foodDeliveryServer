const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../schema/user.schema");
const Cards = require("../schema/user.schema");
const authMiddleware = require('../middleware/Auth')
const isAuth = require('../utils/index')
const { getUserIdByEmail } = require("../utils/index")
const { v4: uuidv4 } = require('uuid');


router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const isUserExists = await User.findOne({ email });
        if (isUserExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "A user with this email already exists",
                keyValue: error.keyValue,
            });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// login  func
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Wrong email or password" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Wrong email or password" });
        }
        const payload = { email: user.email };
        const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
        return res.status(200).json({
            message: "User logged in successfully",
            token: token
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const userId = (await getUserIdByEmail(req.user)).toString();

        if (!userId) {
            return res.status(404).json({ error: "User not found." });
        }
        const user = await User.findById(userId);

        res.status(200).json({
            user: user,
        });
    } catch (error) {
        console.error("Error in /profle route:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


router.post("/update", authMiddleware, async (req, res) => {
    const { name, email, gender, country } = req.body;
    const userId = (await getUserIdByEmail(req.user)).toString();
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.gender = gender || user.gender;
        user.country = country || user.country;
        const updatedUser = await user.save();
        return res.status(200).json({
            message: "User profile updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

})
router.put("/addupdatecard", authMiddleware, async (req, res) => {
    const { cardId, cardHolderName, expiryDate, cvc, cardNumber, isPrimary } = req.body;

    if (!cardHolderName || !expiryDate || !cvc || !cardNumber) {
        return res.status(400).json({ message: "All card details are required." });
    }

    try {
        const userId = (await getUserIdByEmail(req.user)).toString();
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (cardId) {
            const existingCardIndex = user.cards.findIndex(
                (card) => card.cardId === cardId
            );

            if (existingCardIndex !== -1) {
               
                user.cards[existingCardIndex] = {
                    ...user.cards[existingCardIndex]._doc,
                    cardHolderName,
                    expiryDate,
                    cvc,
                    isPrimary: isPrimary || user.cards[existingCardIndex].isPrimary,
                };

                if (isPrimary) {
                    user.cards.forEach((card, idx) => {
                        if (idx !== existingCardIndex) card.isPrimary = false;
                    });
                }
            } else {
                return res.status(404).json({ message: "Card not found for the provided cardId." });
            }
        } else {
           
            const newCard = {
                cardId: uuidv4(),
                cardHolderName,
                expiryDate,
                cvc,
                cardNumber,
                isPrimary: isPrimary || false,
            };

            if (isPrimary) {
                user.cards.forEach(card => card.isPrimary = false);
            }

            user.cards.push(newCard);
        }

        await user.save({ validateModifiedOnly: true });

        res.status(200).json({
            message: "Card added or updated successfully.",
            cards: user.cards,
        });
    } catch (error) {
        console.error("Error saving or updating card:", error);
        res.status(500).json({ message: "An error occurred while saving or updating the card." });
    }
});


router.delete("/deletecard/:cardId", authMiddleware, async (req, res) => {
    const { cardId } = req.params;

    try {
        const userId = (await getUserIdByEmail(req.user)).toString();
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const cardIndex = user.cards.findIndex((card) => card.cardId === cardId);
        if (cardIndex === -1) {
            return res.status(404).json({ message: "Card not found." });
        }

        user.cards.splice(cardIndex, 1); 
        await user.save();

        res.status(200).json({
            message: "Card deleted successfully.",
            cards: user.cards,
        });
    } catch (error) {
        console.error("Error deleting card:", error);
        res.status(500).json({ message: "An error occurred while deleting the card." });
    }
});


router.put("/addupdateaddress", authMiddleware, async (req, res) => {
    const { addId, state, city, postalCode, phoneNumber, fullAddress, isPrimary } = req.body;

    if (!state || !city || !postalCode || !phoneNumber || !fullAddress) {
        return res.status(400).json({ message: "All address details are required." });
    }

    try {
        const userId = (await getUserIdByEmail(req.user)).toString();
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (addId) {

            const existingAddressIndex = user.addresses.findIndex(
                (address) => address.addId === addId
            );

            if (existingAddressIndex !== -1) {
                user.addresses[existingAddressIndex] = {
                    ...user.addresses[existingAddressIndex]._doc,
                    state,
                    city,
                    postalCode,
                    phoneNumber,
                    fullAddress,
                    isPrimary: isPrimary || user.addresses[existingAddressIndex].isPrimary,
                };

                if (isPrimary) {
                    user.addresses.forEach((addr, idx) => {
                        if (idx !== existingAddressIndex) addr.isPrimary = false;
                    });
                }
            } else {
                return res.status(404).json({ message: "Address not found for the provided addId." });
            }
        } else {

            const newAddress = {
                addId: uuidv4(),
                state,
                city,
                postalCode,
                phoneNumber,
                fullAddress,
                isPrimary: isPrimary || false,
            };

            if (isPrimary) {
                user.addresses.forEach(addr => addr.isPrimary = false);
            }

            user.addresses.push(newAddress);
        }

        await user.save({ validateModifiedOnly: true });

        res.status(200).json({
            message: "Address added or updated successfully.",
            addresses: user.addresses,
        });
    } catch (error) {
        console.error("Error saving or updating address:", error);
        res.status(500).json({ message: "An error occurred while saving or updating the address." });
    }
});
router.delete("/deleteaddress/:addId", authMiddleware, async (req, res) => {
    const { addId } = req.params;

    if (!addId) {
        return res.status(400).json({ message: "Address ID is required." });
    }

    try {
        const userId = (await getUserIdByEmail(req.user)).toString();
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const addressIndex = user.addresses.findIndex(
            (address) => address.addId === addId
        );

        if (addressIndex === -1) {
            return res.status(404).json({ message: "Address not found for the provided ID." });
        }

       
        const deletedAddress = user.addresses.splice(addressIndex, 1);

       
        if (deletedAddress[0].isPrimary && user.addresses.length > 0) {
            user.addresses[0].isPrimary = true;
        }

        await user.save({ validateModifiedOnly: true });

        res.status(200).json({
            message: "Address deleted successfully.",
            addresses: user.addresses,
        });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ message: "An error occurred while deleting the address." });
    }
});


module.exports = router;





