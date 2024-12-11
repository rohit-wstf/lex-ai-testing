import "dotenv/config";
import { describe, test } from "vitest";
import LibraryMethods from "../logics/library";

const auth_api = process.env.SERVER_URL;

export default class LibraryTests {
  static libraryUnitTests() {
    describe(`Running tests for ${auth_api} server for Astrix Authentications...`, () => {
      describe("Checking server running health status", () => {
        test("test 1: checking if server running or not", () => {});
      });
    });

    describe("Library Feedback API: POST /feedback", () => {
      test(
        "test 1.1: Successfully submits feedback",
        LibraryMethods.successfullySubmitFeedback
      );
      test(
        "test 1.2: Error when feedback data is invalid",
        LibraryMethods.errorInvalidFeedbackData
      );
      test(
        "test 1.3: Error when user is not authenticated",
        LibraryMethods.errorUserNotAuthenticated
      );
    });
  }
}
