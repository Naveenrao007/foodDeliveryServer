const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./database/connection');
const userRouter = require('./routes/user');
const deliveryRouter = require('./routes/deliveryapp');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/assets/images", express.static("assets/images"));

const PORT = process.env.PORT || 4000;
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is up and running on port ${PORT}`);
    });
});

app.use("/user", userRouter);
app.use("/dashboard", deliveryRouter);
        