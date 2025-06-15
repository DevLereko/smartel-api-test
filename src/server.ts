import http from "http";
import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import routes from "./routes";
import { StatusCodes } from "http-status-codes";
const cors = require("cors");

const router: Express = express();
const db = require("./models/");

router.use(cors());

/** Logging */
router.use(morgan("dev"));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF API */
router.use((req: Request, res: Response, next: NextFunction) => {
  // set the CORS policy
  res.header("Access-Control-Allow-Origin", "*");
  // set the CORS headers
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  // set the CORS method headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    res.status(StatusCodes.OK).json({});
    return;
  }
  next();
});

/** Routes */
router.use("/", routes);

/** Error handling */
router.use((res: Response) => {
  const error = new Error("Requested resource is not found");
  res.status(StatusCodes.NOT_FOUND).json({
    message: error.message,
  });
});

/** Server */
db.sequelize.sync().then(() => {
  const httpServer = http.createServer(router);
  const PORT: any = process.env.PORT ?? 4000;
  httpServer.listen(PORT, () =>
    console.log(`The server is running on port ${PORT}`)
  );
});
