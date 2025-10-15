const dotenv = require('dotenv');
dotenv.config();  // <- this must be called before you use process.env

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// your routes here
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
