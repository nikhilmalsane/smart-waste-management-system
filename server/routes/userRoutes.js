import express from "express"
import protect from "../middlewares/authMiddleware.js"
import { updateAvailability } from "../controllers/userController.js"

const router = express.Router()

router.put("/availability/:id", protect, updateAvailability )

export default router