const express = require("express");
const cors = require("cors");
const buyersRoutes = require("./routes/buyers");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/buyers", buyersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
