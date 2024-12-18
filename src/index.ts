import express from "express";
import { json } from "body-parser";
import { userRoutes } from "./routes/user.route";
import { bookRouter } from "./routes/book.route";

const app = express();
app.use(json());
app.use("/users", userRoutes);
app.use("/books", bookRouter);

app.listen(3000, () => console.log("Running on 3000"));
