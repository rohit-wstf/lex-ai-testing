import pino from "pino";
import path from "path";
import fs from "fs";

const logPath = path.join(path.resolve(), "test.log");
fs.writeFileSync(logPath, "", "utf-8");

const logger = pino(pino.destination({ dest: logPath, flags: "w" }));

export const logSuccess = (description: string, result: any) => {
  logger.info({ description, state: "PASS", result });
};

export const logError = (description: string, error: any) => {
  logger.info({ description, state: "FAIL", error: error.message });
};
