const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const port = process.env.PORT || 5100;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
