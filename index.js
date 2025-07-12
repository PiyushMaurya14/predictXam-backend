const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
const PORT = process.env.PORT || 5000;

//app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});
app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//node index.jsconst cors = require("cors");



