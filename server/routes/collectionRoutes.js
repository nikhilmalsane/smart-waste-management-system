import express from "express"
import { getCollectionHistory, createCollectionHistory, getMonthlyLeaderboard } from "../controllers/collectionController.js"
import { protect } from "../middlewares/authMiddleware.js"
import { authorizeRoles } from "../middlewares/roleMiddleware.js"

const router = express.Router()

router.get("/", protect, authorizeRoles("admin"), getCollectionHistory)
router.post("/", protect, authorizeRoles("staff"), createCollectionHistory)
router.get("/leaderboard", protect, authorizeRoles("admin"), getMonthlyLeaderboard)

export default router