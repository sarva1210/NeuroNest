import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import itemRoutes from "./modules/item/item.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import searchRoutes from "./modules/search/search.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/search", searchRoutes);

app.use(errorHandler);

export default app;