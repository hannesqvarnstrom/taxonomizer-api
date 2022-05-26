import { Router } from "express";
import * as controller from "../controllers/index";
import { authRouter } from "./auth";
import { plantsRouter } from "./plants";

export const index = Router();

index.use('/auth', authRouter)
index.use('/plants', plantsRouter)
index.get("/", controller.index);