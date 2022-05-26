import { Router } from "express";
import * as controller from "../controllers/index";
import { authRouter } from "./auth";

export const index = Router();

index.use('/auth', authRouter)
index.get("/", controller.index);