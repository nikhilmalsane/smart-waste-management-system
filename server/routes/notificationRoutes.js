import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { getNotifications, markAsRead } from "../controllers/notificationController.js";

const router = express.Router()

router.get("/", protect, authorizeRoles("staff"), getNotifications)
router.put("/:id", protect, authorizeRoles("staff"), markAsRead)

export default router