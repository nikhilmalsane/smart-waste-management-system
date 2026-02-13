import express from "express"
import protect from "../middlewares/authMiddleware.js"
import { createOfflineRequest, getAllRequests, updateRequestStatus } from "../controllers/offlineController.js"

const router = express.Router()

router.post("/request", protect, createOfflineRequest)
router.get("/", protect, getAllRequests)
router.put("/:id", protect, updateRequestStatus)

export default router