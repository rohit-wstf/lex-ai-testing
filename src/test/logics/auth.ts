import "dotenv/config";
import { expect } from "vitest";
import { logSuccess, logError } from "../helpers/logger";

const auth_api = process.env.AUTH_URL;

class AuthMethods {}

export default AuthMethods;
