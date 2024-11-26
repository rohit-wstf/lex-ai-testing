import "dotenv/config";
import { describe, test } from "vitest";
import AuthMethods from "../logics/auth";

const auth_api = process.env.AUTH_URL || "http://localhost:7995";

export default class AuthTests {
  static authUnitTests() {
    describe(`Running tests for ${auth_api} server for Astrix Authentications...`, () => {
      describe("Checking server running health status", () => {
        test("test 1: checking if server running or not", () => {});
      });

      // Auth APIs - POST /register
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

      // Auth APIs - POST /login
      describe("Auth API: POST /login", () => {
        test(
          "test 2.1: Successfully logs in a user",
          AuthMethods.successfulLogin
        );
        test(
          "test 2.2: Error when login data is invalid",
          AuthMethods.errorInvalidLoginData
        );
        test(
          "test 2.3: Error when email does not exist",
          AuthMethods.errorEmailDoesNotExist
        );
        test(
          "test 2.4: Error when password is incorrect",
          AuthMethods.errorIncorrectPassword
        );
        test(
          "test 2.5: Missing required data or unwanted data",
          AuthMethods.missingOrExtraDataLogin
        );
      });

      // Auth APIs - GET /token
      describe("Auth API: GET /token", () => {
        test(
          "test 3.1: Successfully retrieves user details",
          AuthMethods.successfulGetUserDetails
        );
        test(
          "test 3.2: Error when token is missing",
          AuthMethods.errorMissingToken
        );
        test(
          "test 3.3: Error when token is invalid",
          AuthMethods.errorInvalidToken
        );
        test(
          "test 3.4: Missing required data or unwanted data",
          AuthMethods.missingOrExtraDataToken
        );
      });
    });
  }
}
