import { Sequelize } from "sequelize";
import User from "./User";
import Book from "./Book";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

User.initialize(sequelize);
Book.initialize(sequelize);

User.associate();
Book.associate();

export default sequelize;
