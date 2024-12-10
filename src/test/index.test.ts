import tests from "./main";

const testType = process.env.TEST_TYPE;


tests.UserTests.userUnitTests();
tests.AuthTests.authUnitTests();
tests.LibraryTests.libraryUnitTests();
tests.VideoTests.videoUnitTests();
tests.SuggestionTests.suggestionUnitTests();

