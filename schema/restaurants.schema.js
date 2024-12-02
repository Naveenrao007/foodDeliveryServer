const mongoose = require("mongoose");

const popularCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    restaurantCount: { type: Number, required: true },
});

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    subcategories: [
        {
            id: { type: String, required: true },
            categoryName: { type: String, required: true },
            items: [
                {
                    id: { type: String, required: true },
                    name: { type: String, required: true },
                    ingredients: [{ type: String }],
                    image: { type: String, required: true },
                    price: { type: Number, required: true },
                },
            ],
        },
    ],
});

const PopularCategory = mongoose.model('PopularCategory', popularCategorySchema);
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = { PopularCategory, Restaurant };
