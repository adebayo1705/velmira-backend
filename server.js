const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://velmira-peach.vercel.app",
      "https://velmira-pqniaib1k-velmira.vercel.app"
    ]
  })
);

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    }
  })
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/admin/users",
  adminUserRoutes
);

app.use(
  "/api/admin/orders",
  adminOrderRoutes
);

app.use(
  "/api/contact",
  contactRoutes
);

app.use(
  "/api/payment",
  paymentRoutes
);

app.get(
  "/",
  (req, res) => {
    res.send(
      "Welcome to the Velmira API!"
    );
  }
);

const PORT =
  process.env.PORT || 5000;

const startServer = async () => {
  try {

    await connectDB();

    app.listen(
      PORT,
      () => {
        console.log(
          `Velmira server is running on port ${PORT}`
        );
      }
    );

  } catch (error) {

    console.error(
      "Server startup failed:"
    );

    console.error(
      error.message
    );

  }
};

startServer();