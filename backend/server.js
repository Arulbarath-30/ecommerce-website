const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Enable cross-origin dispatches
app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ARCHITECTURE ---
const DB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/terabyte_vault";
mongoose.connect(DB_URI)
  .then(() => console.log("🔥 [DB METRICS] MongoDB Native Infrastructure Secured"))
  .catch(err => console.error("❌ [DB ERROR] Database Integration Offline:", err));

// --- 1. MONGODB SCHEMAS & MODELS ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  architect: { type: String, default: "Arul" },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  paymentSystem: { type: String, required: true },
  proofAttached: { type: String, default: "NO" }, 
  screenshotUrl: { type: String, default: "" },
  items: { type: Array, required: true },
  totalAuthorized: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  img: String,
  tag: String,
  spec: String
});

const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);
const Product = mongoose.model('Product', productSchema);

// --- 2. AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email: email.toLowerCase(), password });
    await newUser.save();
    res.status(201).json({ success: true, message: "User Registered" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Registration Error" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), password });
    if (!user) return res.status(401).json({ success: false, message: "Invalid Login" });
    res.status(200).json({ success: true, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login Error" });
  }
});

// --- 3. PRODUCT ROUTES (The Fix) ---

// A. Get All Products for Catalogue
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Inventory Retrieval Failed" });
  }
});

// B. Get Single Product for Details Page
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Node Not Found" });
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Invalid ID Format" });
  }
});

// --- 4. CHECKOUT & ORDERS ---
app.post('/api/checkout', async (req, res) => {
  try {
    const { architect, email, phone, address, paymentSystem, items, total, screenshotUrl } = req.body;
    const transactionId = `TRX-2026-ARUL-${(Math.random() * 9000 + 1000).toFixed(0)}`;

    const newOrder = new Order({
      transactionId,
      architect: architect || "Arul",
      email: email.toLowerCase().trim(),
      phone,
      address,
      paymentSystem,
      proofAttached: screenshotUrl ? "YES" : "NO",
      screenshotUrl: screenshotUrl || "", 
      items,
      totalAuthorized: total
    });

    await newOrder.save();
    res.status(200).json({ success: true, transactionId, message: "Order stored successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Database Error" });
  }
});

app.get('/api/orders/:email', async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Order removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
});

const seedInventory = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const bulkProducts = [
        // --- AUDIO ---
        { name: "Sonic-X Gen 3", price: 12999, category: "Audio", tag: "NEW", spec: "Lossless Audio Engine", img: "https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Acoustic Pods Pro", price: 5999, category: "Audio", tag: "LIMITED", spec: "360 Spatial Audio", img: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Studio Monitor Z", price: 24500, category: "Audio", tag: "ELITE", spec: "Reference Grade Fidelity", img: "https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg?auto=compress&cs=tinysrgb&w=800" },

        // --- WEARABLES ---
        { name: "Titan Chronos", price: 8500, category: "Wearables", tag: "TRENDING", spec: "Titanium Chassis", img: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Pulse Fit Band", price: 3200, category: "Wearables", tag: "STABLE", spec: "Biometric Matrix 2.0", img: "https://images.pexels.com/photos/4370376/pexels-photo-4370376.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Vision Watch SE", price: 15999, category: "Wearables", tag: "PREMIUM", spec: "Micro-OLED Display", img: "https://images.pexels.com/photos/110471/pexels-photo-110471.jpeg?auto=compress&cs=tinysrgb&w=800" },

        // --- MOBILE ---
        { name: "Nexus 15 Ultra", price: 89999, category: "Mobile", tag: "FLAGSHIP", spec: "Snapdragon 8 Gen 4", img: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Fold-X Kinetic", price: 145000, category: "Mobile", tag: "ELITE", spec: "Flexible Carbon Hinge", img: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Core Lite Pro", price: 32000, category: "Mobile", tag: "BEST SELLER", spec: "Performance Node A1", img: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800" },

        // --- VISION ---
        { name: "Terabyte Vision Pro", price: 250000, category: "Vision", tag: "ARCHITECT", spec: "8K Spatial Computing", img: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Glass-X AR", price: 45000, category: "Vision", tag: "FUTURE", spec: "Retina Projection Tech", img: "https://images.pexels.com/photos/3761118/pexels-photo-3761118.jpeg?auto=compress&cs=tinysrgb&w=800" },

        // --- POWER ---
        { name: "Fusion Hub 100W", price: 4500, category: "Power", tag: "ESSENTIAL", spec: "GaN Fast Charge Node", img: "https://images.pexels.com/photos/400678/pexels-photo-400678.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "MegaVolt 50k", price: 7999, category: "Power", tag: "HEAVY DUTY", spec: "50,000mAh Battery Tank", img: "https://images.pexels.com/photos/459762/pexels-photo-459762.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Solar Core Pad", price: 12000, category: "Power", tag: "ECO", spec: "Quantum Solar Panels", img: "https://images.pexels.com/photos/159397/solar-panel-array-power-sun-159397.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Flux Station", price: 3500, category: "Power", tag: "STABLE", spec: "MagSafe 3.0 Compatible", img: "https://images.pexels.com/photos/4195324/pexels-photo-4195324.jpeg?auto=compress&cs=tinysrgb&w=800" }
      ];

      await Product.insertMany(bulkProducts);
      console.log("🔥 [SUCCESS] 15 Premium Stable Artifacts Synchronized!");
    }
  } catch (err) {
    console.error("❌ Seed Error:", err);
  }
};
seedInventory();

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 [METRICS] Terabyte Backend Active on http://localhost:${PORT}`);
});