import tests from "./main";

const testType = process.env.TEST_TYPE;

tests.AuthTests.authUnitTests();
