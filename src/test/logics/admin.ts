import "dotenv/config";
import { expect } from "vitest";
import { logSuccess, logError } from "../helpers/logger";

const admin_api = process.env.ADMIN_API;

const jsonHeader = {
  "Content-Type": "application/json",
};

const validToken = process.env.ADMIN_AUTH_TOKEN;
const tokenMissingUserId = "tokenMissingUserId";
const userEmail = "samiullah@gmail.com";
const userId = "ACVIUZS9";

const chatId = "VE1RUFTH";
const doc_chatUserId = "O11Y1WTH";
const nonExistentChatId = "nonExistentChatId";
const nonExistentUserId = "nonExistentUserId";

const authHeaders = {
  Authorization: `Bearer ${validToken}`,
  "Content-Type": "application/json",
};

// Admin Methods class for testing admin API endpoints
class AdminMethods {
  //    Test 1.1: Successfully fetches user details
  static successfulFetchDetails = async () => {
    let status = null;
    let result = null;

    try {
      const res = await fetch(`${admin_api}/details`, {
        method: "GET",
        headers: jsonHeader,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "detils fetched",
        data: expect.any(Array),
      });
      expect(result.data.length).toBeGreaterThan(0);

      logSuccess("Successfully fetches user details", result);
    } catch (error: any) {
      logError("Successfully fetches user details", error, result, status);
      throw error;
    }
  };

  //   Test 1.4: Ensures the response contains only expected properties
  static validateResponseStructure = async () => {
    let status = null;
    let result = null;

    try {
      const res = await fetch(`${admin_api}/details`, {
        method: "GET",
        headers: jsonHeader,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toHaveProperty("status", true);
      expect(result).toHaveProperty("message", "detils fetched");
      expect(result).toHaveProperty("data");
      expect(Object.keys(result).sort()).toEqual(
        ["status", "message", "data"].sort()
      );

      logSuccess(
        "Ensures the response contains only expected properties",
        result
      );
    } catch (error: any) {
      logError(
        "Ensures the response contains only expected properties",
        error,
        result,
        status
      );
      throw error;
    }
  };

  //   Test 1.5: Handles invalid HTTP methods (e.g., POST, PUT)
  static rejectInvalidHttpMethod = async () => {
    const invalidMethods = ["POST", "PUT", "DELETE"];
    for (const method of invalidMethods) {
      let status = null;
      let result = null;

      try {
        const res = await fetch(`${admin_api}/details`, {
          method,
          headers: jsonHeader,
        });

        result = await res.text(); // Read the response as text
        status = res.status;

        expect(status).toBe(404); // 405 Method Not Allowed
        expect(result).toContain(`Cannot ${method} /admin/details`); // Validate HTML response

        logSuccess(`Handles invalid HTTP method: ${method}`, result);
      } catch (error: any) {
        logError(
          `Handles invalid HTTP method: ${method}`,
          error,
          result,
          status
        );
        throw error;
      }
    }
  };

  //   *************************************** /getfeedbackByUsers ****************************

  // Test 1.1: Successfully retrieves feedback by user
  static successfulGetFeedback = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${admin_api}/getfeedbackByUsers`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "detils fetched",
        feedback: expect.any(Object),
      });

      logSuccess("Successfully retrieves feedback by user", result);
    } catch (error: any) {
      logError(
        "Successfully retrieves feedback by user",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 1.2: Error when user ID is missing in token
  static errorMissingUserId = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${admin_api}/getfeedbackByUsers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenMissingUserId}`,
          "Content-Type": "application/json",
        },
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        message: {
          name: "JsonWebTokenError",
          message: "jwt malformed",
        },
      });

      logSuccess("Error when user ID is missing in token", result);
    } catch (error: any) {
      logError("Error when user ID is missing in token", error, result, status);
      throw error;
    }
  };

  // Test 1.1: Successfully increases credits for users
  static successfulIncreaseCredits = async () => {
    let status = null;
    let result = null;
    try {
      const payload = {
        emails: [`${userEmail}`],
      };

      const res = await fetch(`${admin_api}/credits`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "Credits Increased",
      });

      logSuccess("Successfully increases credits for users", result);
    } catch (error: any) {
      logError(
        "Successfully increases credits for users",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 1.2: Error when no email data is provided in the request
  static errorNoEmailData = async () => {
    let status = null;
    let result = null;
    try {
      const payload = {};

      const res = await fetch(`${admin_api}/credits`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        errors: {
          "body.emails": "Required",
        },
      });

      logSuccess("Error when no email data is provided in the request", result);
    } catch (error: any) {
      logError(
        "Error when no email data is provided in the request",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 1.3: Error when emails array is empty
  static errorEmptyEmailsArray = async () => {
    let status = null;
    let result = null;
    try {
      const payload = {
        emails: [], // Empty emails array
      };

      const res = await fetch(`${admin_api}/credits`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      result = await res.json();
      status = res.status;

      // Assertions for an invalid request with empty emails array
      expect(status).toBe(400); // Assuming a 400 status for validation errors
      expect(result).toMatchObject({
        errors: {
          "body.emails": "Emails array cannot be empty",
        },
      });

      logSuccess("Error when emails array is empty", result);
    } catch (error: any) {
      logError("Error when emails array is empty", error, result, status);
      throw error;
    }
  };

  // Test 1.1: Successfully fetch user details with pagination
  static successfulFetchUserDetails = async () => {
    let status = null;
    let result = null;
    try {
      const queryParams = "?page=1";

      const res = await fetch(`${admin_api}/${queryParams}`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "User Details",
        data: expect.any(Object),
      });
      expect(result.data).toHaveProperty("userDetailsWithChatCount");
      expect(result.data).toHaveProperty("totalUser");

      logSuccess("Successfully fetch user details with pagination", result);
    } catch (error: any) {
      logError(
        "Successfully fetch user details with pagination",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 1.2: Handles database query with empty or out-of-range results
  static errorDatabaseQueryFailure = async () => {
    let status = null;
    let result = null;
    try {
      // Simulate a scenario where the database query might return empty results
      const queryParams = "?page=9999";

      const res = await fetch(`${admin_api}/${queryParams}`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      // Validate that the status is 200 (successful response)
      expect(status).toBe(200);

      // Validate that the response matches the structure
      expect(result).toMatchObject({
        status: true,
        message: "User Details",
        data: {
          userDetailsWithChatCount: expect.any(Array), // Expect an empty array or valid data
          totalUser: {
            userCount: expect.any(String),
            lastActiveCount: expect.any(String),
          },
        },
      });

      logSuccess("Error when database query fails", result);
    } catch (error: any) {
      logError("Error when database query fails", error, result, status);
      throw error;
    }
  };

  // Test 1.3: Default pagination applied when page query is missing
  static defaultPagination = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${admin_api}/`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "User Details",
        data: expect.any(Object),
      });
      expect(result.data.userDetailsWithChatCount).toBeInstanceOf(Array);
      expect(result.data.totalUser).toHaveProperty("userCount");

      logSuccess(
        "Default pagination applied when page query is missing",
        result
      );
    } catch (error: any) {
      logError(
        "Default pagination applied when page query is missing",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 1.1: Successfully fetch document chats with pagination
  static successfulFetchDocChats = async () => {
    let status = null;
    let result = null;
    try {
      const queryParams = "?page=1";

      const res = await fetch(
        `${admin_api}/doc_chat/${doc_chatUserId}${queryParams}`,
        {
          method: "GET",
          headers: authHeaders,
        }
      );

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "Data Fetched",
        data: expect.any(Array),
      });
      expect(result.data.length).toBeLessThanOrEqual(21);

      logSuccess("Successfully fetch document chats with pagination", result);
    } catch (error: any) {
      logError(
        "Successfully fetch document chats with pagination",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 1.2: Error when no document chats are found
  static noDocChatsFound = async () => {
    let status = null;
    let result = null;
    try {
      const userId = "nonExistentUserId"; // Replace with a non-existent user ID
      const queryParams = "?page=1";

      const res = await fetch(`${admin_api}/doc_chat/${userId}${queryParams}`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(500);
      expect(result).toMatchObject({
        status: false,
        message: "Cannot read properties of undefined (reading 'docChats')",
      });

      logSuccess("Error when no document chats are found", result);
    } catch (error: any) {
      logError("Error when no document chats are found", error, result, status);
      throw error;
    }
  };

  // Test 1.3: Default pagination is applied when no query parameter is provided
  static defaultPaginationApplied = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${admin_api}/doc_chat/${doc_chatUserId}`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "Data Fetched",
        data: expect.any(Array),
      });
      expect(result.data.length).toBeLessThanOrEqual(21);

      logSuccess(
        "Default pagination is applied when no query parameter is provided",
        result
      );
    } catch (error: any) {
      logError(
        "Default pagination is applied when no query parameter is provided",
        error,
        result,
        status
      );
      throw error;
    }
  };
  // Test 1.1: Successfully fetch chats with pagination
  static successfulFetchChats = async () => {
    let status = null;
    let result = null;
    try {
      const queryParams = "?page=1";

      const res = await fetch(`${admin_api}/${userId}${queryParams}`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "User Chats",
        data: {
          chats: expect.any(Array),
        },
      });
      expect(result.data.chats.length).toBeLessThanOrEqual(21);

      logSuccess("Successfully fetch chats with pagination", result);
    } catch (error: any) {
      logError(
        "Successfully fetch chats with pagination",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 1.2: Handle case when no chats are found for the given user
  static noChatsFound = async () => {
    let status = null;
    let result = null;
    try {
      const nonExistentUserId = "nonExistentUserId"; // Replace with a non-existent user ID
      const queryParams = "?page=1";

      const res = await fetch(
        `${admin_api}/${nonExistentUserId}${queryParams}`,
        {
          method: "GET",
          headers: authHeaders,
        }
      );

      result = await res.json();
      status = res.status;

      expect(status).toBe(200); // Assuming API returns a 200 even when no chats are found
      expect(result).toMatchObject({
        status: true,
        message: "User Chats",
      });
      // Ensure the response does not contain the `data` property
      expect(result).not.toHaveProperty("data");

      logSuccess(
        "Handle case when no chats are found for the given user",
        result
      );
    } catch (error: any) {
      logError(
        "Handle case when no chats are found for the given user",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 1.3: Default pagination is applied when no query parameter is provided
  static defaultPaginationAppliedd = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${admin_api}/${userId}`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "User Chats",
        data: {
          chats: expect.any(Array),
        },
      });

      logSuccess(
        "Default pagination is applied when no query parameter is provided",
        result
      );
    } catch (error: any) {
      logError(
        "Default pagination is applied when no query parameter is provided",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 1.1: Successfully fetch chat details with questions and answers
  static successfulFetchChatDetails = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${admin_api}/user/${chatId}`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "Chat Questions & Answers",
        data: expect.any(Array),
      });

      const chatData = result.data[0];
      expect(chatData).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        summary: expect.any(String),
      });

      expect(chatData.questions).toBeInstanceOf(Array);
      chatData.questions.forEach((question: any) => {
        expect(question).toMatchObject({
          questionId: expect.any(String),
          question: expect.any(String),
          createdAt: expect.any(String),
          answers: expect.any(Array),
        });

        question.answers.forEach((answer: any) => {
          expect(answer).toMatchObject({
            answersId: expect.any(String),
            answer: expect.any(String),
            createdAt: expect.any(String),
          });
        });
      });

      logSuccess(
        "Successfully fetch chat details with questions and answers",
        result
      );
    } catch (error: any) {
      logError(
        "Successfully fetch chat details with questions and answers",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 1.2: Handle case when no chat is found for the given chat ID
  static noChatFound = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${admin_api}/user/${nonExistentChatId}`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      // Validate that the API returns a successful response with an empty data array
      expect(status).toBe(200); // Assuming a 200 OK status
      expect(result).toMatchObject({
        status: true,
        message: "Chat Questions & Answers",
        data: expect.any(Array),
      });
      expect(result.data.length).toBe(0); // Ensure the data array is empty

      logSuccess(
        "Handle case when no chat is found for the given chat ID",
        result
      );
    } catch (error: any) {
      logError(
        "Handle case when no chat is found for the given chat ID",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 1.1: Successfully update user credits
  static successfulUpdateCredits = async () => {
    let status = null;
    let result = null;
    try {
      const credits = 500;

      const res = await fetch(`${admin_api}/credits/${userId}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ credits }),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "credits updated successfully",
      });

      logSuccess("Successfully update user credits", result);
    } catch (error: any) {
      logError("Successfully update user credits", error, result, status);
      throw error;
    }
  };

  // Test 1.2: Error when credits are missing in the request body
  static missingCreditsError = async () => {
    let status = null;
    let result = null;
    try {
      const payload = {}; // Empty body to simulate the missing credits scenario

      const res = await fetch(`${admin_api}/credits/${userId}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      result = await res.json();
      status = res.status;

      // Assertions for the missing credits error
      expect(status).toBe(400); // Assuming validation errors return 400 status
      expect(result).toMatchObject({
        errors: {
          "body.credits": "Credits are required",
        },
      });

      logSuccess("Error when credits are missing in the request body", result);
    } catch (error: any) {
      logError(
        "Error when credits are missing in the request body",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 1.3: Error when invalid credits value is provided
  static invalidCreditsValue = async () => {
    let status = null;
    let result = null;
    try {
      const userId = "validUserId"; // Replace with a valid user ID
      const credits = "invalidCredits"; // Pass an invalid value for credits

      const res = await fetch(`${admin_api}/credits/${userId}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ credits }),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        errors: {
          "body.credits": "Expected number, received string",
        },
      });

      logSuccess("Error when invalid credits value is provided", result);
    } catch (error: any) {
      logError(
        "Error when invalid credits value is provided",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 1.1: Successfully fetch user's library
  static successfulLibraryFetch = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${admin_api}/library/${doc_chatUserId}`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "Data Fetched",
        data: expect.any(Array),
      });

      logSuccess("Successfully fetch user's library", result);
    } catch (error: any) {
      logError("Successfully fetch user's library", error, result, status);
      throw error;
    }
  };

  // Test 1.2: Error when user ID does not exist
  static nonExistentUserIdd = async () => {
    let status = null;
    let result = null;
    try {
      // Replace with an invalid user ID

      const res = await fetch(`${admin_api}/library/${nonExistentUserId}`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(500);
      expect(result).toMatchObject({
        status: false,
        message: "Error: User Not Found.......",
      });

      logSuccess("Error when user ID does not exist", result);
    } catch (error: any) {
      logError("Error when user ID does not exist", error, result, status);
      throw error;
    }
  };

  // Test 1.3: Error when user has no library data
  static noLibraryData = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${admin_api}/library/${userId}`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(500);
      expect(result).toMatchObject({
        status: false,
        message: "No Library found with this userId",
      });

      logSuccess("Error when user has no library data", result);
    } catch (error: any) {
      logError("Error when user has no library data", error, result, status);
      throw error;
    }
  };

  // Test 2.1: Successfully fetch document chat answers
  static successfulDocChatAnsFetch = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${admin_api}/doc_chat_ans/${chatId}`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "Data Fetched",
      });

      logSuccess("Successfully fetch document chat answers", result);
    } catch (error: any) {
      logError(
        "Successfully fetch document chat answers",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 2.2: Error when chat ID does not exist
  static nonExistentChatId = async () => {
    let status = null;
    let result = null;
    try {
      const chatId = "nonExistentChatId"; // Replace with a non-existent chat ID

      const res = await fetch(`${admin_api}/doc_chat_ans/${chatId}`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(500);
      expect(result).toMatchObject({
        status: false,
        message: expect.any(String),
      });

      logSuccess("Error when chat ID does not exist", result);
    } catch (error: any) {
      logError("Error when chat ID does not exist", error, result, status);
      throw error;
    }
  };
}

export default AdminMethods;
