import dotenv from "dotenv-flow";
import mysql from "mysql";
import { error } from "../utils/log";

dotenv.config({
  silent: true
});

type DatabaseOptions = {
  databaseURL: string;
};

type QueryResponse = {
  success: boolean;
  reason?: string;
  results: any;
  fields: any;
}

interface QueryCallback {
  (response: QueryResponse): void
}

interface SetUserLevelCallback {
  (
    success: boolean,
    reason?: string
  ): void
}

interface GetUserLevelCallback {
  (
    level: number
  ): void
}

class Database {
  options: DatabaseOptions;

  constructor(options?: DatabaseOptions) {
    this.options = Object.assign({
      databaseURL: process.env.CLEARDB_DATABASE_URL
    }, options);
  }

  _connect(): mysql.Connection {
    const connection = mysql.createConnection(this.options.databaseURL);
    connection.connect();
    return connection;
  }

  _runQuery(query: string, callback?: QueryCallback) {
    const connection = this._connect();
    connection.query({
      sql: query,
      timeout: 2500, // 2.5s
    }, (err, results, fields) => {
      if (err) error("err", err);
      if (callback) {
        callback({
          success: !err,
          reason: err && err.code || undefined,
          results,
          fields
        });
      }
    });
    connection.end();
  }

  setUserLevel(userID: string, level: number, callback: SetUserLevelCallback) {
    this._runQuery(
      `REPLACE INTO user_levels (
        user_id,
        level
      ) VALUES (
        ${mysql.escape(userID)},
        ${mysql.escape(level)}
      );`,
      (response) => callback(response.success, response.reason)
    );
  }

  getUserLevel(userID: string, callback: GetUserLevelCallback): void {
    this._runQuery(
      `SELECT level
      FROM user_levels
      WHERE user_id = ${mysql.escape(userID)};`,
      (response) => callback(response.results && response.results.length > 0 && response.results[0].level)
    );
  }
}

export default Database;
