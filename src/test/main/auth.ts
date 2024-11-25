import "dotenv/config";
import { describe, test } from "vitest";
import Methods from "../logics";
import AuthMethods from "../logics/auth";

const auth_api = process.env.AUTH_URL || "http://localhost:7995";

export default class AuthTests {
  static authUnitTests() {
    describe(`Running tests for ${auth_api} server for Astrix Authentications...`, () => {
      describe("Checking server running health status", () => {
        test("test 1: checking if server running or not", () => {});
      });

      describe("Auth API: POST /register", () => {
        test(
          "test 1.1: Successfully registers a user",
          AuthMethods.successfulRegister
        );
        test(
          "test 1.2: Error when registration data is invalid",
          AuthMethods.errorInvalidRegisterData
        );
        test(
          "test 1.3: Error when user already exists",
          AuthMethods.errorUserAlreadyExists
        );
        test(
          "test 1.4: Missing required data or unwanted data",
          AuthMethods.missingOrExtraDataRegister
        );
      });
    });
  }
}
