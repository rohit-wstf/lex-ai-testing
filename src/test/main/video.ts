import "dotenv/config";
import { describe, test } from "vitest";
import VideoMethods from "../logics/video";

const auth_api = process.env.SERVER_URL;

export default class VideoTests {
  static videoUnitTests() {
    describe(`Running tests for ${auth_api} server for Astrix Authentications...`, () => {
      describe("Checking server running health status", () => {
        test("test 1: checking if server running or not", () => {});
      });

      describe("Video Search API: POST /", () => {
        test(
          "test 1.1: Successfully retrieves videos",
          VideoMethods.successfulVideoSearch,
          120000
        );
        test(
          "test 1.2: Error when chat history is not provided",
          VideoMethods.errorChatHistoryNotProvided
        );
      });
    });
  }
}
