const router = require("express").Router();
const bcrypt = require("bcrypt");
const ProductModel = require("../models/ProductModel.js");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken.js");

// create

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new ProductModel(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// edit product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updateProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// delete product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get product only one
router.get("/find/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

// get all products by category and

router.get("/", async (req, res) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;
  try {
    let products;
    if (queryNew) {
      products = await ProductModel.find().sort({ createdAt: -1 }).limit(5);
    } else if (queryCategory) {
      products = await ProductModel.find({
        categories: { $in: [queryCategory] },
      });
    } else {
      products = await ProductModel.find();
    }

    res.status(200).send(products);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

module.exports = router;
