import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import itemRoutes from "./modules/item/item.routes.js";
import searchRoutes from "./modules/search/search.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import graphRoutes from "./modules/graph/graph.routes.js";
import collectionRoutes from "./modules/collection/collection.routes.js";
import resurfaceRoutes from "./modules/resurface/resurface.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS CONFIG
const allowedOrigins = [
  "http://localhost:5173",
  "https://neuronnest-2.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// ROOT
app.get("/", (req, res) => {
  res.send("NeuroNest API is running");
});

// uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/graph", graphRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/resurface", resurfaceRoutes);

app.use(errorHandler);

export default app;