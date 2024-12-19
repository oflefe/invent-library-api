import { Sequelize } from "sequelize";
import { User, Book, BorrowRecord } from "../src/models/index";

const dbUrl =
  process.env.DB_URL ||
  "postgresql://postgres:yourpassword@localhost:5432/library";

const sequelize = new Sequelize(dbUrl);

async function seedDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("Connection established successfully.");

    // Seed Users
    const users = await User.bulkCreate([
      { name: "Alice" },
      { name: "Bob" },
      { name: "Charlie" },
    ]);
    console.log("Users seeded:", users.length);

    // Seed Books
    const books = await Book.bulkCreate([
      { name: "The Great Gatsby" },
      { name: "1984" },
      { name: "To Kill a Mockingbird" },
    ]);
    console.log("Books seeded:", books.length);

    // Seed Borrow Records
    const borrowRecords = await BorrowRecord.bulkCreate([
      {
        userId: users[0].id,
        bookId: books[0].id,
        score: 5,
        returnedAt: new Date(),
      },
      {
        userId: users[1].id,
        bookId: books[1].id,
        score: 4,
        returnedAt: new Date(),
      },
      {
        userId: users[2].id,
        bookId: books[2].id,
        score: 3,
        returnedAt: new Date(),
      },
    ]);
    console.log("Borrow records seeded:", borrowRecords.length);

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seedDatabase();
