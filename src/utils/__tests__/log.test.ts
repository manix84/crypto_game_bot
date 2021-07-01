import chalk from "chalk";
import { log, br, success, fail, info, warn, error, SET_DEBUG_STATE } from "../log";

console.log = jest.fn();

describe("Logs.js :: DEBUG=true", () => {
  beforeAll(() => {
    jest.resetModules();
    SET_DEBUG_STATE(true);
  });

  test("log", () => {
    console.log = jest.fn();
    log("test");
    expect(console.log).toHaveBeenCalledWith("test");
  });

  test("br", () => {
    console.log = jest.fn();
    br();
    expect(console.log).toHaveBeenCalledWith();
  });

  test("success", () => {
    console.log = jest.fn();
    success("test");
    expect(console.log).toHaveBeenCalledWith(chalk.green("test"));
  });

  test("fail", () => {
    console.log = jest.fn();
    fail("test");
    expect(console.log).toHaveBeenCalledWith(chalk.red("test"));
  });

  test("info", () => {
    console.info = jest.fn();
    info("test");
    expect(console.info).toHaveBeenCalledWith(chalk.blue("test"));
  });

  test("warn", () => {
    console.warn = jest.fn();
    warn("test");
    expect(console.warn).toHaveBeenCalledWith(chalk.yellow("test"));
  });

  test("error", () => {
    console.error = jest.fn();
    error("test");
    expect(console.error).toHaveBeenCalledWith(chalk.red("test"));
  });
});

describe("Logs.js :: DEBUG=false", () => {
  beforeAll(() => {
    jest.resetModules();
    SET_DEBUG_STATE(false);
  });

  test("log", () => {
    console.log = jest.fn();
    log("test");
    expect(console.log).not.toHaveBeenCalled();
  });

  test("br", () => {
    console.log = jest.fn();
    br();
    expect(console.log).not.toHaveBeenCalled();
  });

  test("success", () => {
    console.log = jest.fn();
    success("test");
    expect(console.log).not.toHaveBeenCalled();
  });

  test("fail", () => {
    console.log = jest.fn();
    fail("test");
    expect(console.log).not.toHaveBeenCalled();
  });

  test("info", () => {
    console.info = jest.fn();
    info("test");
    expect(console.info).not.toHaveBeenCalled();
  });

  test("warn", () => {
    console.warn = jest.fn();
    warn("test");
    expect(console.warn).not.toHaveBeenCalled();
  });

  test("error", () => {
    console.error = jest.fn();
    error("test");
    expect(console.error).toHaveBeenCalledWith(chalk.red("test"));
  });
});
