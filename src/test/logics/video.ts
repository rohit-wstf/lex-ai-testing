import "dotenv/config";
import { expect } from "vitest";
import { logSuccess, logError } from "../helpers/logger";

const userAuthToken = process.env.USER_AUTH_TOKEN;
const video_api = process.env.SERVER_URL + "/videos";

const v = {};

const jsonHeader = {
  "Content-Type": "application/json",
};

const authHeaders = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + userAuthToken,
};

class VideoMethods {
  // Test 1.1: Successfully retrieves videos
  static successfulVideoSearch = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${video_api}/`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify({
          query: "Find tutorial videos",
          chat_history: [
            { role: "user", content: "Show me Python tutorials" },
            { role: "assistant", content: "Here are some Python tutorials" },
          ],
          chat_model_provider: "openai",
          chat_model: "GPT-4 omni mini",
        }),
      });

      result = await res.json();
      status = res.status;

      if (res.ok) {
        expect(status).toBe(200);
        expect(result).toHaveProperty("videos");
      } else {
        expect(status).toBe(500);
        expect(result).toMatchObject({
          message: "An error has occurred.",
        });
      }

      logSuccess("Successfully retrieves videos", result);
    } catch (error: any) {
      logError("Successfully retrieves videos", error, result, status);
      throw error;
    }
  };

  // Test 1.2: Error when chat history is not provided
  static errorChatHistoryNotProvided = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${video_api}/`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify({
          query: "Find tutorial videos",
          chat_model_provider: "openai",
          chat_model: "GPT-4 omni mini",
        }),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(500);
      expect(result).toMatchObject({
        message: "An error has occurred.",
      });

      logSuccess("Error when chat history is not provided", result);
    } catch (error: any) {
      logError(
        "Error when chat history is not provided",
        error,
        result,
        status
      );
      throw error;
    }
  };
}

export default VideoMethods;
