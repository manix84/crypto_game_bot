import dotenv from "dotenv-flow";
import chalk from "chalk";

dotenv.config({
  silent: true
});

let DEBUG = Boolean(process.env.DEBUG === "true");

const SET_DEBUG_STATE = (state: boolean): void => {
  DEBUG = Boolean(state);
};

const log = (...msgs: any): void => {
  if (DEBUG) console.log(...msgs);
};

const success = (...msgs: any): void => {
  if (DEBUG) console.log(chalk.green(...msgs));
};

const warn = (...msgs: any): void => {
  if (DEBUG) console.warn(chalk.yellow(...msgs));
};

const info = (...msgs: any): void => {
  if (DEBUG) console.info(chalk.blue(...msgs));
};

const fail = (...msgs: any): void => {
  if (DEBUG) console.log(chalk.red(...msgs));
};

const br = (): void => {
  if (DEBUG) console.log();
};

const error = (...msgs: any): void => {
  console.error(chalk.red(...msgs));
};

export {
  log,
  br,
  success,
  fail,
  info,
  warn,
  error,
  SET_DEBUG_STATE
};
