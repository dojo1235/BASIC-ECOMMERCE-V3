import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateRegisterInput, validateLoginInput } from "../validations/auth.validation.js";

const router = Router();

// POST /api/auth/register
router.post("/register", validate(validateRegisterInput), registerUser);

// POST /api/auth/login
router.post("/login", validate(validateLoginInput), loginUser);

export default router;