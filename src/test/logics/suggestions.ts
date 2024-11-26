import "dotenv/config";
import { expect } from "vitest";
import { logSuccess, logError } from "../helpers/logger";

const userAuthToken = process.env.USER_AUTH_TOKEN;
const suggestions_api = process.env.SERVER_URL + "/suggestions";

const v = {};

const jsonHeader = {
  "Content-Type": "application/json",
};

const authHeaders = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + userAuthToken,
};

class SuggestionMethods {
  // Test 1.1: Successfully generates suggestions
  static successfullyGenerateSuggestions = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${suggestions_api}/`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify({
          chat_history: [
            { role: "user", content: "What is the weather like today?" },
            {
              role: "assistant",
              content: "The weather is sunny with a high of 75°F.",
            },
          ],
          chat_model: "gpt-4o-mini",
          chat_model_provider: "openai",
        }),
      });

      result = await res.json();
      status = res.status;

      if (res.ok) {
        expect(status).toBe(200);
        expect(result).toMatchObject({
          suggestions: expect.any(Array),
        });
      } else {
        expect(status).toBe(500);
        expect(result).toMatchObject({
          message: "An error has occurred.",
        });
      }

      logSuccess("Successfully generates suggestions", result);
    } catch (error: any) {
      logError("Successfully generates suggestions", error, result, status);
      throw error;
    }
  };

  // Test 1.2: Error when chat history data is invalid
  static errorInvalidChatHistoryData = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${suggestions_api}/`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify({
          chat_history: "invalid_chat_history_data", // Invalid chat history data
          chat_model: "gpt-4o-mini",
          chat_model_provider: "openai",
        }),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(500);
      expect(result).toMatchObject({
        message: "An error has occurred.",
      });

      logSuccess("Error when chat history data is invalid", result);
    } catch (error: any) {
      logError(
        "Error when chat history data is invalid",
        error,
        result,
        status
      );
      throw error;
    }
  };
}

export default SuggestionMethods;
