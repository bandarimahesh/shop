const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken.js");
const CartModel = require("../models/CartModel.js");

// create cart

router.post("/", verifyToken, async (req, res) => {
  const newCart = new CartModel(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// edit cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updateCart = await CartModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updateCart);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// delete product from cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await CartModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted from cart");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get user cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await CartModel.findOne({ userId: req.params.userId });
    res.status(200).send(cart);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

// get all cart
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await CartModel.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
