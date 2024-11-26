import "dotenv/config";
import { describe, test } from "vitest";
import SuggestionMethods from "../logics/suggestions";

const auth_api = process.env.SERVER_URL;

export default class SuggestionTests {
  static suggestionUnitTests() {
    describe(`Running tests for ${auth_api} server for Astrix Authentications...`, () => {
      describe("Checking server running health status", () => {
        test("test 1: checking if server running or not", () => {});
      });

      describe("Generate Suggestions API: POST /", () => {
        test(
          "test 1.1: Successfully generates suggestions",
          SuggestionMethods.successfullyGenerateSuggestions
        );
        test(
          "test 1.2: Error when chat history data is invalid",
          SuggestionMethods.errorInvalidChatHistoryData
        );
      });
    });
  }
}
