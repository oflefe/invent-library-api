import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare name: string;
  declare id: CreationOptional<number>;
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "user",
    defaultScope: {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
  }
);

export class Book extends Model<
  InferAttributes<Book>,
  InferCreationAttributes<Book>
> {
  declare name: string;
  declare id: CreationOptional<number>;
  declare borrowedById: number | null;
  declare averageRating: number | null;

  toJSON() {
    return {
      name: this.name,
      averageRating: this.averageRating,
    };
  }
}
Book.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    borrowedById: { type: DataTypes.INTEGER, allowNull: true },
    averageRating: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "book",
    defaultScope: {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
  }
);

export class BorrowRecord extends Model<
  InferAttributes<BorrowRecord>,
  InferCreationAttributes<BorrowRecord>
> {
  declare userId: number;
  declare bookId: number;
  declare score: number | null;
  declare returnedAt: Date | null;
}
BorrowRecord.init(
  {
    userId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER,
    score: { type: DataTypes.INTEGER, allowNull: true },
    returnedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "borrowRecord",
    defaultScope: {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
  }
);

User.hasMany(BorrowRecord, { foreignKey: "userId" });
Book.hasMany(BorrowRecord, { foreignKey: "bookId" });
BorrowRecord.belongsTo(User, { foreignKey: "userId" });
BorrowRecord.belongsTo(Book, { foreignKey: "bookId" });

sequelize.sync().then(() => {
  console.log("Database synced");
});
