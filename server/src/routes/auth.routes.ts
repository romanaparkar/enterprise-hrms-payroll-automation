// Auth routes — maps URLs to controller functions.
// Mounted under /api/auth in app.ts, so this becomes POST /api/auth/register.

import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);

export default router;
