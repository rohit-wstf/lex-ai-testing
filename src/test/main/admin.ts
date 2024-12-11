// auth.ts
import "dotenv/config";
import { describe, test } from "vitest";

import AdminMethods from "../logics/admin";

const auth_api = process.env.SERVER_URL;

export default class AdminTest {
  static adminUnitTests() {
    describe(`Running tests for ${auth_api} server for Lex-AI admin...`, () => {
      describe("Checking server running health status", () => {
        test("test 1: checking if server running or not", () => {});
      });

      // Admin API: GET /details
      describe("Admin API: GET /details", () => {
        test(
          "Test 1.1: Successfully fetches user details",
          AdminMethods.successfulFetchDetails
        );

        test(
          "Test 1.4: Ensures the response contains only expected properties",
          AdminMethods.validateResponseStructure
        );
        test(
          "Test 1.5: Handles invalid HTTP methods (e.g., POST, PUT)",
          AdminMethods.rejectInvalidHttpMethod
        );
      });

      describe("Feedback API: GET /getfeedbackByUsers", () => {
        test(
          "test 1.1: Successfully retrieves feedback by user",
          AdminMethods.successfulGetFeedback
        );
        test(
          "test 1.2: Error when user ID is missing in token",
          AdminMethods.errorMissingUserId
        );
      });

      describe("Credits API: POST /credits", () => {
        test(
          "test 1.1: Successfully increases credits for users",
          AdminMethods.successfulIncreaseCredits
        );

        test(
          "test 1.2: Error when no email data is provided in the request",
          AdminMethods.errorNoEmailData
        );

        test(
          "Test 1.3: Error when emails array is empty",
          AdminMethods.errorEmptyEmailsArray
        );
      });

      describe("Details API: GET /", () => {
        test(
          "test 1.1: Successfully fetch user details with pagination",
          AdminMethods.successfulFetchUserDetails
        );
        test(
          "test 1.2: Handles database query with empty or out-of-range results",
          AdminMethods.errorDatabaseQueryFailure
        );
        test(
          "test 1.3: Default pagination applied when page query is missing",
          AdminMethods.defaultPagination
        );
      });

      describe("Doc Chats API: GET /doc_chat/:userId", () => {
        test(
          "test 1.1: Successfully fetch document chats with pagination",
          AdminMethods.successfulFetchDocChats
        );

        test(
          "test 1.2: Error when no document chats are found",
          AdminMethods.noDocChatsFound
        );

        test(
          "test 1.3: Default pagination is applied when no query parameter is provided",
          AdminMethods.defaultPaginationApplied
        );
      });

      describe("Get Chats API: GET /:userId", () => {
        test(
          "test 1.1: Successfully fetch chats with pagination",
          AdminMethods.successfulFetchChats
        );

        test(
          "test 1.2: Handle case when no chats are found for the given user",
          AdminMethods.noChatsFound
        );
        test(
          "test 1.3: Default pagination is applied when no query parameter is provided",
          AdminMethods.defaultPaginationAppliedd
        );
      });

      describe("Chats Questions Answer API: GET /user/:chatId", () => {
        test(
          "test 1.1: Successfully fetch chat details with questions and answers",
          AdminMethods.successfulFetchChatDetails
        );
        test(
          "test 1.2:Handle case when no chat is found for the given chat ID",
          AdminMethods.noChatFound
        );
      });

      describe("Update Credits API: PATCH /credits/:userId", () => {
        test(
          "test 1.1: Successfully update user credits",
          AdminMethods.successfulUpdateCredits
        );

        test(
          "Test 1.2: Error when credits are missing in the request body",
          AdminMethods.missingCreditsError
        );

        test(
          "test 1.3: Error when invalid credits value is provided",
          AdminMethods.invalidCreditsValue
        );
      });

      describe("Library API: GET /library/:userId", () => {
        test(
          "test 1.1: Successfully fetch user's library",
          AdminMethods.successfulLibraryFetch
        );

        test(
          "test 1.2: Error when user ID does not exist",
          AdminMethods.nonExistentUserIdd
        );

        test(
          "test 1.3: Error when user has no library data",
          AdminMethods.noLibraryData
        );
      });

      describe("Document Chat Answers API: GET /doc_chat_ans/:chatId", () => {
        test(
          "test 2.1: Successfully fetch document chat answers",
          AdminMethods.successfulDocChatAnsFetch
        );
      });
    });
  }
}
