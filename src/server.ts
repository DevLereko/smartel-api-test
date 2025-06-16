import http from "http";
import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import routes from "./routes";
import { StatusCodes } from "http-status-codes";
const cors = require("cors");

const router: Express = express();
const db = require("./models/");

/** Middleware */
router.use(cors());
router.use(morgan("dev"));
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

/** RULES OF API */
router.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    res.status(StatusCodes.OK).json({});
    return;
  }
  next();
});

/** Routes */
router.use("/", routes);

/** 404 Catch-All */
router.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: "Requested resource is not found",
  });
});

/** Global Error Handler */
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message || "Internal Server Error",
  });
});

/** DB Initialization and Server Start */
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected successfully.");

    await db.sequelize.sync();
    console.log("Database schema synced.");

    await db.initializeRoles();

    const httpServer = http.createServer(router);
    const PORT: any = process.env.PORT ?? 4000;
    httpServer.listen(PORT, () =>
      console.log(`Server is running on port ${PORT}`)
    );
  } catch (error) {
    console.error("Failed to start server due to DB error:", error);
    process.exit(1);
  }
})();
