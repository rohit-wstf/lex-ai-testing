import "dotenv/config";
import { describe, test } from "vitest";
import Methods from "../logics";

const auth_api = process.env.AUTH_URL;

export default class AuthTests {
  static authUnitTests() {
    describe(`Running tests for ${auth_api} server for Astrix Authentications...`, () => {
      describe("Checking server running health status", () => {
        test("test 1: checking if server running or not", () => {});
      });
    });
  }
}
