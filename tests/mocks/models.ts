import { vi } from "vitest";
import { MockModel } from "./sequelize";

export const UserMock = {
  ...MockModel,
  findAll: vi.fn().mockResolvedValue([{ id: 1, name: "Alice" }]),
};

export const BookMock = {
  ...MockModel,
  findByPk: vi
    .fn()
    .mockResolvedValue({ id: 1, name: "The Great Gatsby", score: 5 }),
};

export const BorrowRecordMock = {
  ...MockModel,
  create: vi.fn().mockResolvedValue({ id: 1, userId: 1, bookId: 1, rating: 5 }),
};

export function mocks() {
  vi.mock("../src/models/Book", () => BookMock);
  vi.mock("../src/models/User", () => UserMock);
}
