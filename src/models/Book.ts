import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
  Association,
} from "sequelize";
import User from "./User";

export default class Book extends Model<
  InferAttributes<Book>,
  InferCreationAttributes<Book>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare borrowerId: CreationOptional<number | null>;
  declare score: CreationOptional<number | null>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare static associations: {
    borrower: Association<Book, User>;
  };

  static initialize(sequelize: Sequelize) {
    Book.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        borrowerId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        score: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "books",
        timestamps: true,
      }
    );
  }

  static associate() {
    Book.belongsTo(User, { as: "borrower", foreignKey: "borrowerId" });
  }
}
