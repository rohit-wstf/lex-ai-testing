import "dotenv/config";
import { expect } from "vitest";
import { logSuccess, logError } from "../helpers/logger";
import { Console } from "console";

const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI4NiwiYWN0aXZlQ2hhdElkIjoxNDAxLCJpc1ByZW1pdW0iOmZhbHNlLCJpYXQiOjE3MzI2MTQ1MzF9.FOzEqRwKaRa5jK2wdeJG5k7V-72_AstzWVoGYKFUfy4";

const auth_api = process.env.AUTH_URL || "http://localhost:7995";

const v = {
  validRegisterPayload: {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
    location: "New York",
    occupation: "Developer",
    refId: "123456789",
    avatar: "http://example.com/avatar.jpg",
  },
  invalidRegisterPayload: {
    email: "invalid email",
    password: "short",
  },
  existingUserRegisterPayload: {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
    location: "New York",
    occupation: "Developer",
    refId: "123456789",
    avatar: "http://example.com/avatar.jpg",
  },

  validLoginPayload: {
    email: "john.doe@example.com",
    password: "password123",
  },
};

const jsonHeader = {
  "Content-Type": "application/json",
};

const authHeaders = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + authToken,
};

class AuthMethods {
  // Test 1.1: Successfully registers a user
  static successfulRegister = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/register`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(v.validRegisterPayload),
      });

      result = await res.json();
      status = res.status;

      if (res.ok) {
        expect(status).toBe(200);
        expect(result).toMatchObject({
          status: true,
          message: "User registered",
          data: expect.any(Object),
        });
      } else {
        expect(status).toBe(500);
        expect(result).toMatchObject({
          status: false,
          message: "Error: User already exists",
        });
      }

      logSuccess("Successfully registers a user", result);
    } catch (error: any) {
      logError("Successfully registers a user", error, result, status);
      throw error;
    }
  };

  // Test 1.2: Error when registration data is invalid
  static errorInvalidRegisterData = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/register`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(v.invalidRegisterPayload),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result.errors).toBeDefined();

      logSuccess("Error when registration data is invalid", result);
    } catch (error: any) {
      logError(
        "Error when registration data is invalid",
        error,
        result,
        status
      );
      throw error;
    }
  };

  // Test 1.3: Error when user already exists
  static errorUserAlreadyExists = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/register`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(v.existingUserRegisterPayload),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(500);
      expect(result).toMatchObject({
        status: false,
        message: "Error: User already exists",
      });

      logSuccess("Error when user already exists", result);
    } catch (error: any) {
      logError("Error when user already exists", error, result, status);
      throw error;
    }
  };

  // Test 1.4: Missing required data or unwanted data
  static missingOrExtraDataRegister = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(
        `${auth_api}/register?unwantedQuery=unwantedQuery`,
        {
          method: "POST",
          headers: jsonHeader,
          body: JSON.stringify({
            unwantedBody: "unwantedBody",
          }),
        }
      );

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result.errors).toEqual({
        "body.name": "Name is required",
        "body.password": "Password is required",
        "body.email": "Email is required",
        query: expect.stringContaining(
          "Unrecognized key(s) in object: 'unwantedQuery'"
        ),
      });

      logSuccess("Missing required data or unwanted data", result);
    } catch (error: any) {
      logError("Missing required data or unwanted data", error, result, status);
      throw error;
    }
  };

  // Test 2.1: Successfully logs in a user
  static successfulLogin = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/login`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(v.validLoginPayload),
      });

      result = await res.json();
      status = res.status;

      if (res.ok) {
        expect(status).toBe(200);
        expect(result).toMatchObject({
          status: true,
          message: "Logged In Successfully",
          data: expect.any(Object),
        });
      } else {
        expect(status).toBe(500);
        expect(result).toMatchObject({
          status: false,
          message: "Please enter valid Email",
        });
      }

      logSuccess("Successfully logs in a user", result);
    } catch (error: any) {
      logError("Successfully logs in a user", error, result, status);
      throw error;
    }
  };

  // Test 2.2: Error when login data is invalid
  static errorInvalidLoginData = async () => {
    let status = null;
    let result = null;
    try {
      let invalidLoginPayload = {
        email: "invalid-email",
        password: "",
      };
      const res = await fetch(`${auth_api}/login`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(invalidLoginPayload),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result.errors).toBeDefined();

      logSuccess("Error when login data is invalid", result);
    } catch (error: any) {
      logError("Error when login data is invalid", error, result, status);
      throw error;
    }
  };

  // Test 2.3: Error when email does not exist
  static errorEmailDoesNotExist = async () => {
    let status = null;
    let result = null;
    try {
      let nonExistentEmailLoginPayload = {
        email: "non-existent-email@example.com",
        password: "password",
      };
      const res = await fetch(`${auth_api}/login`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(nonExistentEmailLoginPayload),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(500);
      expect(result).toMatchObject({
        status: false,
        message: "Please enter valid Email",
      });

      logSuccess("Error when email does not exist", result);
    } catch (error: any) {
      logError("Error when email does not exist", error, result, status);
      throw error;
    }
  };

  // Test 2.4: Error when password is incorrect
  static errorIncorrectPassword = async () => {
    let status = null;
    let result = null;
    try {
      let incorrectPasswordLoginPayload = {
        email: v.validLoginPayload.email,
        password: "WrongPassword",
      };
      const res = await fetch(`${auth_api}/login`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(incorrectPasswordLoginPayload),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(500);
      expect(result).toMatchObject({
        status: false,
        message: "Enter Valid Password",
      });

      logSuccess("Error when password is incorrect", result);
    } catch (error: any) {
      logError("Error when password is incorrect", error, result, status);
      throw error;
    }
  };

  // Test 2.5: Missing required data or unwanted data
  static missingOrExtraDataLogin = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/login?unwantedQuery=unwantedQuery`, {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify({
          unwantedBody: "unwantedBody",
        }),
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result.errors).toEqual({
        "body.email": "Email is required",
        "body.password": "Password is required",
        query: expect.stringContaining(
          "Unrecognized key(s) in object: 'unwantedQuery'"
        ),
      });

      logSuccess("Missing required data or unwanted data", result);
    } catch (error: any) {
      logError("Missing required data or unwanted data", error, result, status);
      throw error;
    }
  };

  // Test 3.1: Successfully retrieves user details
  static successfulGetUserDetails = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/token`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      if (res.ok) {
        expect(status).toBe(200);
        expect(result).toMatchObject({
          status: true,
          message: "Logged In Successfully",
          data: expect.any(Object),
        });
      } else {
        expect(status).toBe(500);
        expect(result).toMatchObject({
          status: false,
          message: expect.any(String),
        });
      }

      logSuccess("Successfully retrieves user details", result);
    } catch (error: any) {
      logError("Successfully retrieves user details", error, result, status);
      throw error;
    }
  };

  // Test 3.2: Error when token is missing
  static errorMissingToken = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/token`, {
        method: "GET",
        headers: jsonHeader,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        message: "Token not Found",
      });

      logSuccess("Error when token is missing", result);
    } catch (error: any) {
      logError("Error when token is missing", error, result, status);
      throw error;
    }
  };

  // Test 3.3: Error when token is invalid
  static errorInvalidToken = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/token`, {
        method: "GET",
        headers: {
          ...jsonHeader,
          Authorization: "Bearer invalidToken",
        },
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result).toMatchObject({
        message: "User not Found",
      });

      logSuccess("Error when token is invalid", result);
    } catch (error: any) {
      logError("Error when token is invalid", error, result, status);
      throw error;
    }
  };

  // Test 3.4: Missing required data or unwanted data
  static missingOrExtraDataToken = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/token?unwantedQuery=unwantedQuery`, {
        method: "GET",
        headers: authHeaders,
      });

      result = await res.json();
      status = res.status;

      expect(status).toBe(400);
      expect(result.errors).toEqual({
        query: expect.stringContaining(
          "Unrecognized key(s) in object: 'unwantedQuery'"
        ),
      });

      logSuccess("Missing required data or unwanted data", result);
    } catch (error: any) {
      logError("Missing required data or unwanted data", error, result, status);
      throw error;
    }
  };
}

export default AuthMethods;
