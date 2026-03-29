import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import itemRoutes from "./modules/item/item.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import searchRoutes from "./modules/search/search.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import graphRoutes from "./modules/graph/graph.routes.js";
import resurfaceRoutes from "./modules/resurface/resurface.routes.js";
import collectionRoutes from "./modules/collection/collection.routes.js";
import highlightRoutes from "./modules/highlight/highlight.routes.js";
import insightRoutes from "./modules/insight/insight.routes.js";
import timelineRoutes from "./modules/timeline/timeline.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/graph", graphRoutes);
app.use("/api/resurface", resurfaceRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/highlights", highlightRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/timeline", timelineRoutes);

app.use(errorHandler);

export default app;