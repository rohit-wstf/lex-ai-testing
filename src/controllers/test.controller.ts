import { Request, Response } from "express";
import { spawn } from "child_process";
import path from "path";
import { readFile, unlink } from "fs/promises";
import authtests from "../testsuites/auth.testsuits.json";

const logPath = path.join(path.resolve(), "test.log");

export interface customRequest extends Request {
  testType?: string;
  testName?: string;
}
const validTestTypes = ["auth", "event"];

export default class TestController {
  static async sendTestSuites(req: Request, res: Response) {
    if (!authtests) {
      return res
        .status(404)
        .json({ status: false, msg: "Error fetching testsuit..." });
    }
    return res.status(200).json(authtests);
  }

  static async runAllTests(req: customRequest, res: Response): Promise<void> {
    const { testtype } = req.params;

    if (
      !testtype ||
      typeof testtype !== "string" ||
      !validTestTypes.includes(testtype)
    ) {
      res.status(400).json({
        error:
          "Invalid testType parameter. Allowed values are 'auth' or 'event'.",
      });
      return;
    }

    try {
      const testProcess = spawn("npm", ["test"], {
        env: { ...process.env, TEST_TYPE: testtype || "" },
      });

      testProcess.stdout.on("data", (data: Buffer) => {
        console.log("Test Process reading data: " + data);
      });

      testProcess.stderr.on("data", (data: Buffer) => {
        console.log("Test Process reading error: " + data);
      });

      testProcess.on("close", async (code: number) => {
        console.log(`Test process exited with code ${code}`);

        try {
          const rawData = await readFile(logPath, "utf-8");
          await unlink(logPath);

          const data = rawData
            .split("\n")
            .filter((line) => line.trim())
            .map((line) => {
              try {
                return JSON.parse(line);
              } catch (error) {
                console.error("Failed to parse log line:", line, error);
                return null;
              }
            })
            .filter((entry) => entry !== null);

          res.status(200).json(data);
          return;
        } catch (err: any) {
          res.status(500).json({ error: "Failed to process log data" });
          return;
        }
      });

      testProcess.on("error", (err: any) => {
        res.status(500).json({ error: "Test process failed to start" });
        return;
      });
    } catch (err: any) {
      res.status(500).json({ error: "Unexpected error occurred" });
      return;
    }
  }

  static async runSingleTest(req: customRequest, res: Response): Promise<void> {
    const { testName } = req.body;
    const { testtype } = req.params;

    if (
      (!testtype && !testName) ||
      (typeof testtype !== "string" && typeof testName !== "string") ||
      !validTestTypes.includes(testtype)
    ) {
      res.status(400).json({
        error:
          "Invalid testType or testName. Allowed values are 'auth' or 'event' for testType.",
      });
      return;
    }

    try {
      const testProcess = spawn(
        "npm",
        ["test", "--", "--testNamePattern", `${testName}`],
        {
          env: { ...process.env, TEST_TYPE: testtype || "" },
        }
      );

      testProcess.stdout.on("data", (data: Buffer) => {
        //   console.log(`Test Output: ${data}`);
        console.log("Test Process reading data : " + data);
      });

      testProcess.stderr.on("data", (data: Buffer) => {
        //   console.error(`Test Error: ${data}`);
        console.log("Test Process reading error : " + data);
      });

      testProcess.on("close", async (code: number) => {
        console.log(`Test process exited with code ${code}`);

        try {
          const rawData = await readFile(logPath, "utf-8");
          await unlink(logPath);

          const data = rawData
            .split("\n")
            .filter((line) => line.trim())
            .map((line) => {
              try {
                return JSON.parse(line);
              } catch (error: any) {
                console.error("Failed to parse log line:", line, error);
                return null;
              }
            })
            .filter((entry) => entry !== null);

          res.status(200).json(data);
          return;
        } catch (err: any) {
          // console.error("Failed to read or delete log file", err);
          res.status(500).json({ error: "Failed to process log data" });
          return;
        }
      });

      testProcess.on("error", (err: any) => {
        //   console.error("Test process failed to start", err);
        res.status(500).json({ error: "Test process failed to start" });
        return;
      });
    } catch (err) {
      // console.error("Unexpected error:", err);
      res.status(500).json({ error: "Unexpected error occurred" });
      return;
    }
  }
}
