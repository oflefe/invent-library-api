import { vi } from "vitest";

vi.mock("sequelize", async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  const Sequelize = vi.fn(() => ({
    define: vi.fn(),
    sync: vi.fn().mockResolvedValue(true),
    DataTypes: {
      STRING: "STRING",
      INTEGER: "INTEGER",
    },
  }));
  const Model: any = vi.fn();
  Model.init = vi.fn();
  Model.hasMany = vi.fn();
  Model.belongsTo = vi.fn();
  Model.findAll = vi.fn();
  Model.findByPk = vi.fn();
  Model.findOne = vi.fn();
  Model.create = vi.fn();
  return { ...actual, Sequelize, Model };
});
