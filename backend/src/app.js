import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import itemRoutes from "./modules/item/item.routes.js";
import searchRoutes from "./modules/search/search.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import graphRoutes from "./modules/graph/graph.routes.js";
import collectionRoutes from "./modules/collection/collection.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/graph", graphRoutes);
app.use("/api/collections", collectionRoutes);

app.use(errorHandler);

export default app;