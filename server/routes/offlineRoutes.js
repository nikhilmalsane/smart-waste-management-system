import express from "express"
import protect from "../middlewares/authMiddleware.js"
import { createOfflineRequest, getAllRequests, updateRequestStatus, goOnline } from "../controllers/offlineController.js"
import authorizeRoles from "../middlewares/roleMiddleware.js"

const router = express.Router()

router.post("/request", protect, createOfflineRequest)
router.get("/", protect, authorizeRoles("admin"), getAllRequests)
router.put("/:id", protect, updateRequestStatus)
router.post("/go-online", protect, goOnline)
 
export default router 