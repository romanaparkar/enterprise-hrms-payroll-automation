// Auth routes — maps URLs to controller functions.
// Mounted under /api/auth in app.ts.

import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Protected: requires a valid Bearer token.
router.get("/me", protect, getMe);

export default router;
