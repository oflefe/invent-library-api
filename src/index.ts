import express from "express";
import userRoutes from "./routes/user.route";
import bookRoutes from "./routes/book.route";
import sequelize from "./models";
import "./models/User";
import "./models/Book";

sequelize.sync().then(() => {
  console.log("Database synced");
});

const app = express();
app.use(express.json());
app.use("/users", userRoutes);
app.use("/books", bookRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
