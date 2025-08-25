import { Router } from "express";
import { loginCaptain, registerCaptain } from "../controllers/captainController.js";


const router = Router();

router.post("/register", registerCaptain);
router.post("/login", loginCaptain);

export default router;
