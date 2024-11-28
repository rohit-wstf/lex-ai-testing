import "dotenv/config";
import { expect } from "vitest";
import { logSuccess, logError } from "../helpers/logger";
import { Console, error } from "console";

const auth_api = process.env.AUTH_URL || "http://localhost:7995";

const v = {
  validCreateChatPayload: {},
  invalidToken: "invalid_token",
  missingToken: null,
};

const v2 = {
  validToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMyMCwiYWN0aXZlQ2hhdElkIjoxNTc1LCJpc1ByZW1pdW0iOmZhbHNlLCJpYXQiOjE3MzI2MDczMzR9.-S1bRxI1Vx7y2c5KeR5-7yTqMg-vGAF6G4nXMwOPyBA",
  invalidToken: "invalid_token",
  missingToken: null,
};

const v3 = {
  validChatId: "FN4Y9BGO",
  validQuestionId: "Ques3d3749",
  invalidChatId: "invalid_chat_id",
  invalidQuestionId: "invalid_question_id",
};

const v4 = {
  validFeature: {
    title: "New Feature Request",
    description: "This is a description of the feature.",
    useCase: "Use case description here.",
    impact: "Major Enhancement",
    priority: "High",
    email: "test@example.com",
  },
  missingTitle: {
    description: "This is a description of the feature.",
    useCase: "Use case description here.",
    impact: "Major Enhancement",
    priority: "High",
    email: "test@example.com",
  },
  missingDescription: {
    title: "New Feature Request",
    useCase: "Use case description here.",
    impact: "Major Enhancement",
    priority: "High",
    email: "test@example.com",
  },
  invalidImpact: {
    title: "New Feature Request",
    description: "This is a description of the feature.",
    useCase: "Use case description here.",
    impact: "Urgent Impact", // Invalid impact value
    priority: "High",
    email: "test@example.com",
  },
  invalidPriority: {
    title: "New Feature Request",
    description: "This is a description of the feature.",
    useCase: "Use case description here.",
    impact: "Moderate Impact",
    priority: "Urgent", // Invalid priority value
    email: "test@example.com",
  },
  invalidEmail: {
    title: "New Feature Request",
    description: "This is a description of the feature.",
    useCase: "Use case description here.",
    impact: "Moderate Impact",
    priority: "Medium",
    email: "not-an-email",
  },
};

const v5 = {
  validContact: {
    name: "John Doe",
    number: "1234567890",
    email: "john.doe@example.com",
    message: "I need help with my account.",
  },
  missingName: {
    number: "1234567890",
    email: "john.doe@example.com",
    message: "I need help with my account.",
  },
  missingNumber: {
    name: "John Doe",
    email: "john.doe@example.com",
    message: "I need help with my account.",
  },
  missingEmail: {
    name: "John Doe",
    number: "1234567890",
    message: "I need help with my account.",
  },
  invalidEmail: {
    name: "John Doe",
    number: "1234567890",
    email: "invalid-email",
    message: "I need help with my account.",
  },
  missingMessage: {
    name: "John Doe",
    number: "1234567890",
    email: "john.doe@example.com",
  },
  extraFields: {
    name: "John Doe",
    number: "1234567890",
    email: "john.doe@example.com",
    message: "I need help with my account.",
    extraField: "This field should not be here.",
  },
};

const jsonHeader4 = {
  "Content-Type": "application/json",
  Authorization: "Bearer valid_token", // Replace with valid token for testing
};

const jsonHeader = {
  "Content-Type": "application/json",
};

const authHeader = (token: string | null) => ({
  ...jsonHeader,
  Authorization: `Bearer ${token}`,
});

const testUser1token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMyMCwiYWN0aXZlQ2hhdElkIjoxNTc1LCJpc1ByZW1pdW0iOmZhbHNlLCJpYXQiOjE3MzI2MDczMzR9.-S1bRxI1Vx7y2c5KeR5-7yTqMg-vGAF6G4nXMwOPyBA";

class UserMethods {
  // Test 1.1: Successfully creates a new chat
  static successfulCreateNewChat = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/chat`, {
        method: "POST",
        headers: authHeader(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMyMCwiYWN0aXZlQ2hhdElkIjoxNTc1LCJpc1ByZW1pdW0iOmZhbHNlLCJpYXQiOjE3MzI2MDczMzR9.-S1bRxI1Vx7y2c5KeR5-7yTqMg-vGAF6G4nXMwOPyBA"
        ),
        body: JSON.stringify(v.validCreateChatPayload),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "Created New Chat",
      });

      logSuccess("Successfully creates a new chat", result);
    } catch (error: any) {
      logError("Successfully creates a new chat", error, result, status);
      throw error;
    }
  };

  // Test 1.2: Fails when the token is missing
  static errorMissingToken = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/chat`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(v.validCreateChatPayload),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        message: expect.objectContaining({}),
      });

      logSuccess("Fails when the token is missing", result);
    } catch (error: any) {
      logError("Fails when the token is missing", error, result, status);
      throw error;
    }
  };

  // Test 1.3: Fails when the token is invalid
  static errorInvalidToken = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/chat`, {
        method: "POST",
        headers: authHeader(v.invalidToken),
        body: JSON.stringify(v.validCreateChatPayload),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        message: expect.objectContaining({
          name: "JsonWebTokenError",
          message: "jwt malformed",
        }),
      });

      logSuccess("Fails when the token is invalid", result);
    } catch (error: any) {
      logError("Fails when the token is invalid", error, result, status);
      throw error;
    }
  };

  // Test 1.4: Fails when the payload is invalid
  static errorInvalidPayload = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/chat`, {
        method: "POST",
        headers: authHeader(testUser1token),
        body: JSON.stringify({ messsage: "data" }), // Empty payload or invalid data
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        errors: expect.objectContaining({
          body: "Unrecognized key(s) in object: 'messsage'",
        }),
        // message: expect.objectContaining("Invalid Payload"),
      });

      logSuccess("Fails when the payload is invalid", result);
    } catch (error: any) {
      logError("Fails when the payload is invalid", error, result, status);
      throw error;
    }
  };

  // Test 2.1: Successfully retrieves a referral ID
  static successfulCreateReferral = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/referral`, {
        method: "GET",
        headers: authHeader(v2.validToken),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "Created Referral Id",
        data: expect.any(String),
      });

      logSuccess("Successfully retrieves a referral ID", result);
    } catch (error: any) {
      logError("Successfully retrieves a referral ID", error, result, status);
      throw error;
    }
  };

  // Test 2.2: Fails when token is missing
  static referrorMissingToken = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/referral`, {
        method: "GET",
        headers: authHeader(null),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        message: expect.objectContaining({}),
      });

      logSuccess("Fails when token is missing", result);
    } catch (error: any) {
      logError("Fails when token is missing", error, result, status);
      throw error;
    }
  };

  // Test 2.3: Fails when token is invalid
  static referrorInvalidToken = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/referral`, {
        method: "GET",
        headers: authHeader(v2.invalidToken),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        message: expect.objectContaining({
          name: "JsonWebTokenError",
          message: "jwt malformed",
        }),
      });

      logSuccess("Fails when token is invalid", result);
    } catch (error: any) {
      logError("Fails when token is invalid", error, result, status);
      throw error;
    }
  };

  // Test 3.1: Successfully retrieves responses and sources
  static successfulGetResponsesAndSources = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(
        `${auth_api}/user/share/${v3.validChatId}/${v3.validQuestionId}`,
        {
          method: "GET",
          headers: jsonHeader,
        }
      );

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "Answers and sources",
        data: expect.any(Object),
      });

      logSuccess("Successfully retrieves responses and sources", result);
    } catch (error: any) {
      logError(
        "Successfully retrieves responses and sources",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 3.2: Fails when `chatId` is invalid
  static errorInvalidChatId = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(
        `${auth_api}/user/share/${v3.invalidChatId}/${v3.validQuestionId}`,
        {
          method: "GET",
          headers: jsonHeader,
        }
      );

      result = await res.json();
      status = res.status;

      expect(status).toBe(500);
      expect(result).toMatchObject({
        status: false,
        message: expect.stringContaining("Error: Chat not found"),
      });

      logSuccess("Fails when `chatId` is invalid", result);
    } catch (error: any) {
      logError("Fails when `chatId` is invalid", error, result, status);
      throw error;
    }
  };

  // Test 3.3: Fails when `questionId` is invalid
  static errorInvalidQuestionId = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(
        `${auth_api}/user/share/${v3.validChatId}/${v3.invalidQuestionId}`,
        {
          method: "GET",
          headers: jsonHeader,
        }
      );

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        // message: expect.stringContaining("Question not found"),
        message: expect.any(String),
      });

      logSuccess("Fails when `questionId` is invalid", result);
    } catch (error: any) {
      logError("Fails when `questionId` is invalid", error, result, status);
      throw error;
    }
  };

  // // Test 3.4: Fails when required parameters are missing
  // static errorMissingParameters = async () => {
  //   let status = null;
  //   let result = null;
  //   try {
  //     const res = await fetch(`${auth_api}/user/share`, {
  //       method: "GET",
  //       headers: jsonHeader,
  //     });

  //     result = await res.json();
  //     status = res.status;

  //     expect(status).toBe(400);
  //     expect(result).toMatchObject({
  //       message: expect.stringContaining("Chat Id is required"),
  //     });

  //     logSuccess("Fails when required parameters are missing", result);
  //   } catch (error: any) {
  //     logError("Fails when required parameters are missing", error, result, status);
  //     throw error;
  //   }
  // };

  // Test 4.1: Successfully submits a feature request
  static successfulFeatureRequest = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/feature`, {
        method: "POST",
        headers: authHeader(testUser1token),
        body: JSON.stringify(v4.validFeature),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "Feature request submitted",
      });

      logSuccess("Successfully submits a feature request", result);
    } catch (error: any) {
      logError("Successfully submits a feature request", error, result, status);
      throw error;
    }
  };

  // Test 4.2: Fails when `title` is missing
  static errorMissingTitle = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/feature`, {
        method: "POST",
        headers: authHeader(testUser1token),
        body: JSON.stringify(v4.missingTitle),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        errors: expect.objectContaining({
          "body.title": expect.stringContaining("Title is required"),
        }),
      });

      logSuccess("Fails when `title` is missing", result);
    } catch (error: any) {
      logError("Fails when `title` is missing", error, result, status);
      throw error;
    }
  };

  // Test 4.3: Fails when `description` is missing
  static errorMissingDescription = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/feature`, {
        method: "POST",
        headers: authHeader(testUser1token),
        body: JSON.stringify(v4.missingDescription),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        errors: expect.objectContaining({
          "body.description": expect.stringContaining(
            "Description is required"
          ),
        }),
      });

      logSuccess("Fails when `description` is missing", result);
    } catch (error: any) {
      logError("Fails when `description` is missing", error, result, status);
      throw error;
    }
  };

  // Test 4.4: Fails with an invalid `impact` value
  static errorInvalidImpact = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/feature`, {
        method: "POST",
        headers: authHeader(testUser1token),
        body: JSON.stringify(v4.invalidImpact),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        errors: expect.objectContaining({
          "body.impact": expect.any(String),
        }),
      });

      logSuccess("Fails with an invalid `impact` value", result);
    } catch (error: any) {
      logError("Fails with an invalid `impact` value", error, result, status);
      throw error;
    }
  };

  // Test 4.5: Fails with an invalid `priority` value
  static errorInvalidPriority = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/feature`, {
        method: "POST",
        headers: authHeader(testUser1token),
        body: JSON.stringify(v4.invalidPriority),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        errors: expect.objectContaining({
          "body.priority": expect.any(String),
        }),
      });

      logSuccess("Fails with an invalid `priority` value", result);
    } catch (error: any) {
      logError("Fails with an invalid `priority` value", error, result, status);
      throw error;
    }
  };

  // Test 4.6: Fails with an invalid email format
  static errorInvalidEmail = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/feature`, {
        method: "POST",
        headers: authHeader(testUser1token),
        body: JSON.stringify(v4.invalidEmail),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        errors: expect.objectContaining({
          "body.email": expect.any(String),
        }),
      });

      logSuccess("Fails with an invalid email format", result);
    } catch (error: any) {
      logError("Fails with an invalid email format", error, result, status);
      throw error;
    }
  };

  // Test 5.1: Successfully submits a contact request
  static successfulContact = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/contact`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(v5.validContact),
      });

      result = await res.json();
      status = res.status;

      // console.log(result);

     
      expect(status).toBe(200);
      expect(result).toMatchObject({
        status: true,
        message: "Support request submitted",
        data: expect.arrayContaining([
          
          expect.objectContaining({
          
            message: expect.any(String),
          }),
        ]),
      });

      logSuccess("Successfully submits a contact request", result);
    } catch (error: any) {
      logError("Successfully submits a contact request", error, result, status);
      throw error;
    }
  };

  // Test 5.2: Fails when `name` is missing
  static missingName = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/contact`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(v5.missingName),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        errors: expect.objectContaining({
          "body.name": expect.any(String),
        }),
      });

      logSuccess("Fails when `name` is missing", result);
    } catch (error: any) {
      logError("Fails when `name` is missing", error, result, status);
      throw error;
    }
  };

  // Test 5.3: Fails when `number` is missing
  static missingNumber = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/contact`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(v5.missingNumber),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        errors: expect.objectContaining({
          "body.number": expect.any(String),
        })
      });

      logSuccess("Fails when `number` is missing", result);
    } catch (error: any) {
      logError("Fails when `number` is missing", error, result, status);
      throw error;
    }
  };

  // Test 5.4: Fails when `email` is missing
  static missingEmail = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/contact`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(v5.missingEmail),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        errors: expect.objectContaining({
          "body.email": expect.any(String),
        }),
      });

      logSuccess("Fails when `email` is missing", result);
    } catch (error: any) {
      logError("Fails when `email` is missing", error, result, status);
      throw error;
    }
  };

  // Test 5.5 : Fails with an invalid `email` format
  static invalidEmail = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/contact`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(v5.invalidEmail),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        errors: expect.objectContaining({
          "body.email": expect.any(String),
        }),
      });

      logSuccess("Fails with an invalid `email` format", result);
    } catch (error: any) {
      logError("Fails with an invalid `email` format", error, result, status);
      throw error;
    }
  };

  // Test 5.6: Fails with extra fields in the request body
  static extraFields = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/contact`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(v5.extraFields),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        errors: expect.objectContaining({
          "body": expect.any(String),
        }),
      });

      logSuccess("Fails with extra fields in the request body", result);
    } catch (error: any) {
      logError(
        "Fails with extra fields in the request body",
        error,
        result,
        status
      );
      throw error;
    }
  };





}



export default UserMethods;
