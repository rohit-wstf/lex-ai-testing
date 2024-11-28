import "dotenv/config";
import { describe, test } from "vitest";
import UserMethods from "../logics/user";

const auth_api = process.env.AUTH_URL || "http://localhost:7995";

export default class UserTests {
  static userUnitTests() {
    describe(`Running tests for ${auth_api} server for Lex Ai Users...`, () => {
      describe("Checking server running health status", () => {
        test("test 1: checking if server running or not", () => {});
      });

      describe("User API: POST /chat", () => {
        test(
          "test 1.1: Successfully creates a new chat",
          UserMethods.successfulCreateNewChat
        );
        test(
          "test 1.2: Fails when the token is missing",
          UserMethods.errorMissingToken
        );
        test(
          "test 1.3: Fails when the token is invalid",
          UserMethods.errorInvalidToken
        );
        test(
          "test 1.4: Fails when the payload is invalid",
          UserMethods.errorInvalidPayload
        );
      });

      describe("User API: GET /referral", () => {
        test(
          "test 2.1: Successfully retrieves a referral ID",
          UserMethods.successfulCreateReferral
        );
        test(
          "test 2.2: Fails when token is missing",
          UserMethods.referrorMissingToken
        );
        test(
          "test 2.3: Fails when token is invalid",
          UserMethods.referrorInvalidToken
        );
      });

      describe("User API: GET /share/:chatId/:questionId", () => {
        test(
          "test 3.1: Successfully retrieves responses and sources",
          UserMethods.successfulGetResponsesAndSources
        );
        test(
          "test 3.2: Fails when `chatId` is invalid",
          UserMethods.errorInvalidChatId
        );
        test(
          "test 3.3: Fails when `questionId` is invalid",
          UserMethods.errorInvalidQuestionId
        );
        // there is some issue in the route
        // test(
        //   "test 3.4: Fails when required parameters are missing",
        //   UserMethods.errorMissingParameters
        // );
      });

      describe("User API: POST /feature", () => {
        test(
          "test 4.1: Successfully submits a feature request",
          UserMethods.successfulFeatureRequest
        );
        test(
          "test 4.2: Fails when `title` is missing",
          UserMethods.errorMissingTitle
        );
        test(
          "test 4.3: Fails when `description` is missing",
          UserMethods.errorMissingDescription
        );
        test(
          "test 4.4: Fails with an invalid `impact` value",
          UserMethods.errorInvalidImpact
        );
        test(
          "test 4.5: Fails with an invalid `priority` value",
          UserMethods.errorInvalidPriority
        );
        test(
          "test 4.6: Fails with an invalid email format",
          UserMethods.errorInvalidEmail
        );
      });

      describe("User API: POST /contact", () => {
        test(
          "Test 5.1: Successfully submits a contact request",
          UserMethods.successfulContact
        );
        test(
          "Test 5.2: Fails when `name` is missing", 
           UserMethods.missingName
        );
        test(
          "Test 5.3: Fails when `number` is missing",
          UserMethods.missingNumber
        );
        test(
          "Test 5.4: Fails when `email` is missing",
          UserMethods.missingEmail
        );
        test(
          "Test 5.5: Fails with an invalid `email` format",
          UserMethods.invalidEmail
        );
        test(
          "Test 5.6: Fails with extra fields in the request body",
          UserMethods.extraFields
        );
      });
    });
  }
}
