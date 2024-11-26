import "dotenv/config";
import { expect } from "vitest";
import { logSuccess, logError } from "../helpers/logger";

const userAuthToken = process.env.USER_AUTH_TOKEN;
const library_api = process.env.SERVER_URL + "/library";

const v = {};

const jsonHeader = {
  "Content-Type": "application/json",
};

const authHeaders = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + userAuthToken,
};

class LibraryMethods {
  // Test 1.1: Successfully submits feedback
  static successfullySubmitFeedback = async () => {
    let status = null;
    let result = null;
    try {
      console.log("authHeaders", authHeaders);
      const res = await fetch(`${library_api}/feedback`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          libId: 123,
          metaData: { id: "abc123" },
          relevance: true,
        }),
      });

      result = await res.json();
      status = res.status;

      if (res.ok) {
        expect(status).toBe(200);
        expect(result).toMatchObject({
          status: true,
          message: "Feedback submitted",
        });
      } else {
        expect(status).toBe(500);
        expect(result).toMatchObject({
          status: false,
          message: "An error has occurred.",
        });
      }

      logSuccess("Successfully submits feedback", result);
    } catch (error: any) {
      logError("Successfully submits feedback", error, result, status);
      throw error;
    }
  };

  // Test 1.2: Error when feedback data is invalid
  static errorInvalidFeedbackData = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${library_api}/feedback`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          libId: "invalid", // Invalid libId
          metaData: { id: 123 }, // Invalid id type
          relevance: "yes", // Invalid relevance type
        }),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toHaveProperty("errors");
      expect(result.errors).toEqual({
        "body.libId": "Expected number, received string",
        "body.metaData.id": "Expected string, received number",
        "body.relevance": "Expected boolean, received string",
      });

      logSuccess("Error when feedback data is invalid", result);
    } catch (error: any) {
      logError("Error when feedback data is invalid", error, result, status);
      throw error;
    }
  };

  // Test 1.3: Error when user is not authenticated
  static errorUserNotAuthenticated = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${library_api}/feedback`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify({
          libId: 123,
          metaData: { id: "abc123" },
          relevance: true,
        }),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        message: "Token not Found",
      });

      logSuccess("Error when user is not authenticated", result);
    } catch (error: any) {
      logError("Error when user is not authenticated", error, result, status);
      throw error;
    }
  };
}

export default LibraryMethods;
