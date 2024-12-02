
const fs = require("fs");
const path = require('path');

function convertImageToBase64(imagePath) {
    try {
        const image = fs.readFileSync(path.resolve(__dirname, imagePath));
        return Buffer.from(image).toString('base64');
    } catch (error) {
        console.error(`Error reading image at ${imagePath}:`, error.message);
        return null;
    }
}
const seedCategories = [
    { name: "Soups", image: convertImageToBase64("../assets/images/soups.png"), restaurantCount: 30 },
    { name: "Breakfast", image: convertImageToBase64("../assets/images/breakfast.png"), restaurantCount: 20 },
    { name: "Burgers & Fast food", image: convertImageToBase64("../assets/images/burger.png"), restaurantCount: 23 },
    { name: "Pizza", image: convertImageToBase64("../assets/images/pizza.png"), restaurantCount: 150 },
    { name: "Pasta & Casuals", image: convertImageToBase64("../assets/images/pasta.png"), restaurantCount: 40 },
    { name: "Salads", image: convertImageToBase64("../assets/images/salad.png"), restaurantCount: 25 }, // Ensure correct file name
];

const restaurant = {
    id: "res001",
    name: "McDonald’s Indore  ",
    image: convertImageToBase64("../assets/images/restaurants/macd.png"),
    subcategories: [
        {
            id: "cat001",
            categoryName: "Burger",
            items: [
                {
                    id: "item001",
                    name: "Classic Cheeseburger",
                    ingredients: ["Beef Patty", "Cheddar Cheese", "Lettuce", "Tomato", "Brioche Bun"],
                    image: convertImageToBase64("../assets/images/category/combo.png"),
                    price: 250,
                },
                {
                    id: "item002",
                    name: "Chicken BBQ Burger",
                    ingredients: ["Grilled Chicken", "BBQ Sauce", "Onion Rings", "Lettuce", "Sesame Bun"],
                    image: convertImageToBase64("../assets/images/category/specialCombo.png"),
                    price: 220,
                },
                {
                    id: "item003",
                    name: "Veggie Delight Burger",
                    ingredients: ["Veggie Patty", "Lettuce", "Tomato", "Pickles", "Whole Wheat Bun"],
                    image: convertImageToBase64("../assets/images/category/combo.png"),
                    price: 200,
                },
                {
                    id: "item004",
                    name: "Spicy Jalapeño Burger",
                    ingredients: ["Beef Patty", "Jalapeños", "Pepper Jack Cheese", "Chipotle Mayo", "Sesame Bun"],
                    image: convertImageToBase64("../assets/images/category/specialCombo.png"),
                    price: 270,
                },
                {
                    id: "item005",
                    name: "Fish Fillet Burger",
                    ingredients: ["Fish Fillet", "Tartar Sauce", "Lettuce", "Brioche Bun"],
                    image: convertImageToBase64("../assets/images/category/combo.png"),
                    price: 240,
                },
            ],
        },
        {
            id: "cat002",
            categoryName: "Fries",
            items: [
                {
                    id: "item006",
                    name: "Classic Fries",
                    ingredients: ["Potatoes", "Salt", "Seasoning"],
                    image: convertImageToBase64("../assets/images/category/fries.png"),
                    price: 100,
                },
                {
                    id: "item007",
                    name: "Cheese Fries",
                    ingredients: ["Potatoes", "Cheese Sauce", "Herbs"],
                    image: convertImageToBase64("../assets/images/category/specialFries.png"),
                    price: 150,
                },
                {
                    id: "item008",
                    name: "Curly Fries",
                    ingredients: ["Potatoes", "Spices", "Salt"],
                    image: convertImageToBase64("../assets/images/category/fries.png"),
                    price: 120,
                },
                {
                    id: "item009",
                    name: "Peri Peri Fries",
                    ingredients: ["Potatoes", "Peri Peri Seasoning"],
                    image: convertImageToBase64("../assets/images/category/specialFries.png"),
                    price: 130,
                },
                {
                    id: "item010",
                    name: "Loaded Bacon Fries",
                    ingredients: ["Potatoes", "Bacon Bits", "Cheese Sauce", "Spring Onions"],
                    image: convertImageToBase64("../assets/images/category/fries.png"),
                    price: 180,
                },
            ],
        },
        {
            id: "cat003",
            categoryName: "ColdDrink",
            items: [
                {
                    id: "item011",
                    name: "Coca-Cola",
                    ingredients: ["Carbonated Water", "Sugar", "Flavorings"],
                    image: convertImageToBase64("../assets/images/category/coldDrink1.png"),
                    price: 50,
                },
                {
                    id: "item012",
                    name: "Lemonade",
                    ingredients: ["Lemon Juice", "Sugar", "Water", "Mint"],
                    image: convertImageToBase64("../assets/images/category/coldDrink2.png"),
                    price: 70,
                },
                {
                    id: "item013",
                    name: "Iced Tea",
                    ingredients: ["Brewed Tea", "Ice", "Lemon", "Sugar"],
                    image: convertImageToBase64("../assets/images/category/coldDrink3.png"),
                    price: 60,
                },
                {
                    id: "item014",
                    name: "Orange Soda",
                    ingredients: ["Carbonated Water", "Orange Flavor", "Sugar"],
                    image: convertImageToBase64("../assets/images/category/coldDrink4.png"),
                    price: 55,
                },
                {
                    id: "item015",
                    name: "Mango Smoothie",
                    ingredients: ["Mango Pulp", "Milk", "Ice", "Sugar"],
                    image: convertImageToBase64("../assets/images/category/coldDrink4.png"),
                    price: 80,
                },
            ],
        },
    ],
};


module.exports = { restaurant, seedCategories }