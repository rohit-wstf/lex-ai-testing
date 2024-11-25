import "dotenv/config";
import { expect } from "vitest";
import { logSuccess, logError } from "../helpers/logger";
import { Console } from "console";

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
};

const jsonHeader = {
  "Content-Type": "application/json",
};

const authHeaders = {
  "Content-Type": "application/json",
  Authorization: "Bearer valid_token",
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
}

export default AuthMethods;
