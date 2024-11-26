import "dotenv/config";
import { describe, test } from "vitest";
import UserMethods from "../logics/user";

const auth_api = process.env.AUTH_URL || "http://localhost:7995";


export default class UserTests {
    static userUnitTests() {

        describe(`Running tests for ${auth_api} server for Lex Ai Users...`, () => {
            describe("Checking server running health status", () => {
                test("test 1: checking if server running or not", () => {});
            });
             
            describe("User API: POST /chat", () => {
                test(
                  "test 1.1: Successfully creates a new chat",
                  UserMethods.successfulCreateNewChat
                );
                test(
                  "test 1.2: Fails when the token is missing",
                  UserMethods.errorMissingToken
                );
                test(
                  "test 1.3: Fails when the token is invalid",
                  UserMethods.errorInvalidToken
                );
                test("test 1.4: Fails when the payload is invalid", UserMethods.errorInvalidPayload);
              });  

        });


    }
}