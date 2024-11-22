import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import router from "./routes";
import config from "dotenv/config";

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: true, message: "Hello from server side" });
});

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found. Please check the URL and try again.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
