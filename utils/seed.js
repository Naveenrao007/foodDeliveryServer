const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require('path');

const { seedCategories, restaurant } = require("./seedingData");

const { PopularCategory, Restaurant } = require("../schema/restaurants.schema");
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB:", err));

const checkCategoriesExist = async () => {
    try {
        const categoriesCount = await PopularCategory.countDocuments();
        return categoriesCount > 0;
    } catch (error) {
        console.error("Error checking categories existence:", error);
        return false;
    }
};

const createPopularCategories = async () => {
    try {
        const categoriesExist = await checkCategoriesExist();
        if (categoriesExist) {
            console.log("Categories already exist. Skipping seeding.");
            return;
        }

        for (let categoryData of seedCategories) {
            if (!categoryData.image) {
                console.error(`Skipping ${categoryData.name} due to missing image.`);
                continue;
            }

            const newCategory = new PopularCategory({
                name: categoryData.name,
                image: categoryData.image,
                restaurantCount: categoryData.restaurantCount,
            });

            await newCategory.save();
            console.log(`Popular Category saved: ${categoryData.name}`);
        }
    } catch (error) {
        console.error("Error saving Popular Categories:", error);
    }
};
const checkRestaurantExist = async () => {
    try {
        const restaurantCount = await Restaurant.countDocuments();
        return restaurantCount > 0;
    } catch (error) {
        console.error("Error checking restaurant existence:", error);
        return false;
    }
};


const createRestaurant = async () => {
    try {
        const restaurantExist = await checkRestaurantExist();
        if (restaurantExist) {
            console.log("Restaurant already exists. Skipping seeding.");
            return;
        }

        const newRestaurant = new Restaurant({
            name: restaurant.name,
            image: restaurant.image,
            subcategories: restaurant.subcategories.map((subcategory) => ({
                id: subcategory.id,
                categoryName: subcategory.categoryName,
                items: subcategory.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    ingredients: item.ingredients,
                    image: item.image,
                    price: item.price,
                })),
            })),
        });

        await newRestaurant.save();
        console.log(`Restaurant saved: ${restaurant.name}`);
    } catch (error) {
        console.error("Error saving restaurant:", error);
    }
};


const seedDatabase = async () => {
    await createRestaurant();
    await createPopularCategories();
};

seedDatabase();