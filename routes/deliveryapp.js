const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../schema/user.schema");
const authMiddleware = require('../middleware/Auth')
const isAuth = require('../utils/index')
const { getUserIdByEmail } = require("../utils/index")
const { PopularCategory, Restaurant } = require("../schema/restaurants.schema"); // Assuming Restaurant schema is defined here



const getPopularCategory = async () => {
    try {
        const popularCategorydata = await PopularCategory.find();
        return popularCategorydata
    } catch (error) {
        console.error("Error fetching popular category:", error);
        return null;
    }
};

const getRestaurantData = async () => {
    try {
        const restaurants = await Restaurant.find(); // Fetch all restaurant data from the DB
        return restaurants; // Return all restaurant documents
    } catch (error) {
        console.error("Error fetching restaurant data:", error);
        return null;
    }
};


router.get("/home", authMiddleware, async (req, res) => {
    try {
        const userId = (await getUserIdByEmail(req.user)).toString();
        if (!userId) {
            return res.status(404).json({ error: "User not found." });
        }
        const user = await User.findById(userId);


        const popularCategory = await getPopularCategory();
        if (!popularCategory) {
            return res.status(500).json({ error: "Error fetching popular category." });
        }

        const restaurantData = await getRestaurantData();
        if (!restaurantData) {
            return res.status(500).json({ error: "Error fetching restaurant data." });
        }

        res.status(200).json({
            user: user,
            popularCategory: popularCategory,
            restaurantData: restaurantData,
        });
    } catch (error) {
        console.error("Error in /home route:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
router.get("/restaurants", authMiddleware, async (req, res) => {
    try {
        const userId = (await getUserIdByEmail(req.user)).toString();
        if (!userId) {
            return res.status(404).json({ error: "User not found." });
        }
        const user = await User.findById(userId);


        const restaurantData = await getRestaurantData();
        if (!restaurantData) {
            return res.status(500).json({ error: "Error fetching restaurant data." });
        }

        res.status(200).json({
            user:user,
            restaurantData: restaurantData,
        });
    } catch (error) {
        console.error("Error in /restaurants route:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
