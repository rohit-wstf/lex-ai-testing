import "dotenv/config";
import { expect } from "vitest";
import { logSuccess, logError } from "../helpers/logger";
import { Console } from "console";

const auth_api = process.env.AUTH_URL || "http://localhost:7995";

const v = {
    validCreateChatPayload: {},
    invalidToken: "invalid_token",
    missingToken: null,
  };

const jsonHeader = {
    "Content-Type": "application/json",
};

const authHeader = (token: string | null) => ({
    ...jsonHeader,
    Authorization: `Bearer ${token}`,
  });

  const testUser1token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMyMCwiYWN0aXZlQ2hhdElkIjoxNTc1LCJpc1ByZW1pdW0iOmZhbHNlLCJpYXQiOjE3MzI2MDczMzR9.-S1bRxI1Vx7y2c5KeR5-7yTqMg-vGAF6G4nXMwOPyBA'

class UserMethods {

 // Test 1.1: Successfully creates a new chat
  static successfulCreateNewChat = async () => {
    let status = null;
    let result = null;
    try {
      const res = await fetch(`${auth_api}/user/chat`, {
        method: "POST",
        headers: authHeader("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMyMCwiYWN0aXZlQ2hhdElkIjoxNTc1LCJpc1ByZW1pdW0iOmZhbHNlLCJpYXQiOjE3MzI2MDczMzR9.-S1bRxI1Vx7y2c5KeR5-7yTqMg-vGAF6G4nXMwOPyBA"),
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
        body: JSON.stringify({"messsage":"data"}),  // Empty payload or invalid data
      });
   
        

      result = await res.json();
      status = res.status;
  
      expect(status).toBe(400);
      expect(result).toMatchObject({
        errors:expect.objectContaining({
            body: "Unrecognized key(s) in object: 'messsage'"
        })
        // message: expect.objectContaining("Invalid Payload"),
      });
  
      logSuccess("Fails when the payload is invalid", result);
    } catch (error: any) {
      logError("Fails when the payload is invalid", error, result, status);
      throw error;
    }
  };
  
  
  

  // Test 2.1: 


}

export default UserMethods;