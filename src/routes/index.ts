import express from "express";
import controllers from "../controllers";

const router = express.Router();

router.get("/testsuites", controllers.TestController.sendTestSuites);

router.get("/testAll/:testtype", controllers.TestController.runAllTests);

router.post("/test/:testtype", controllers.TestController.runSingleTest);

export default router;
