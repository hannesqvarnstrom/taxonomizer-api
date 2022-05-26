import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";
import * as path from "path";
import knex from './knex'
import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";
import { BadRequest, TError } from "./middlewares/errors";

// Routes
import { index } from "./routes/index";
// Create Express server
export const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(express.json())
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", index);
app.use(errorNotFoundHandler);
app.use(errorHandler);
