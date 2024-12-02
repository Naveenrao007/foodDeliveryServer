const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../schema/user.schema");
const Cards = require("../schema/user.schema");
const authMiddleware = require('../middleware/Auth')
const isAuth = require('../utils/index')
const { getUserIdByEmail } = require("../utils/index")

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
    const createdByUserId = (await getUserIdByEmail(req.user)).toString();
    try {
        const user = await User.findById(createdByUserId);
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
    const { cardHolderName, expiryDate, cvc, cardNumber, isPrimary } = req.body;
    const userId = (await getUserIdByEmail(req.user)).toString();

    // Validate required fields
    if (!cardHolderName || !expiryDate || !cvc || !cardNumber) {
        return res.status(400).json({ message: "All card details are required." });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Find the existing card in the user's cards array
        const existingCardIndex = user.cards.findIndex(
            (card) => card.cardNumber === cardNumber
        );

        if (existingCardIndex !== -1) {
            // Update the existing card
            user.cards[existingCardIndex] = {
                ...user.cards[existingCardIndex]._doc, // Ensure existing fields are preserved
                cardHolderName,
                expiryDate,
                cvc,
                isPrimary: isPrimary || false,
            };

            // Ensure only one card is marked as primary
            if (isPrimary) {
                user.cards.forEach((card, index) => {
                    if (index !== existingCardIndex) {
                        card.isPrimary = false;
                    }
                });
            }
        } else {
            // Add a new card
            user.cards.push({
                cardHolderName,
                expiryDate,
                cvc,
                cardNumber,
                isPrimary: isPrimary || false,
            });

            // Ensure only one card is marked as primary
            if (isPrimary) {
                user.cards.forEach((card) => {
                    if (card.cardNumber !== cardNumber) {
                        card.isPrimary = false;
                    }
                });
            }
        }

        // Save the updated user document
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
    const userId = (await getUserIdByEmail(req.user)).toString(); 
    try {
       
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const cardIndex = user.cards.findIndex((card) => card._id.toString() === cardId);
        if (cardIndex === -1) {
            return res.status(404).json({ message: "Card not found." });
        }

       
        user.cards.splice(cardIndex, 1);
        await user.save();

        res.status(200).json({
            message: "Card deleted successfully.",
            cards: user.cards, // Return the updated list of cards
        });
    } catch (error) {
        console.error("Error deleting card:", error);
        res.status(500).json({ message: "An error occurred while deleting the card." });
    }
});

module.exports = router;





