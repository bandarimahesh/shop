const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
dotenv.config();
const app = express();
app.use(express.json());

const authRoute = require("./routes/authRoute.js");
const userRoute = require("./routes/userRoute.js");
const productRoute = require("./routes/product.js");
const cartRoute = require("./routes/cart.js");
const orderRoute = require("./routes/order.js");
app.use(cors());

mongoose.connect(process.env.MONGO_CONNECTION_URL, () => {
  console.log("connected");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);

const port = process.env.PORT || 5100;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
