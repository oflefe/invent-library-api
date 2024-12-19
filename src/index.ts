import express from "express";
import { json } from "body-parser";
import { userRoutes } from "./routes/user.route";
import { bookRoutes } from "./routes/book.route";

const app = express();
app.use(json());
app.use("/users", userRoutes);
app.use("/books", bookRoutes);

app.listen(3000, () => console.log("Running on 3000"));
