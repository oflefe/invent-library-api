import { vi } from "vitest";

const MockSequelize = vi.fn().mockImplementation(() => ({
  authenticate: vi.fn().mockResolvedValue(true),
  define: vi.fn(),
  sync: vi.fn(),
  close: vi.fn(),
}));

const MockModel = {
  findAll: vi.fn(),
  findByPk: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  destroy: vi.fn(),
};

const mockSequelizeInstance = new MockSequelize();

export { MockModel, mockSequelizeInstance };
