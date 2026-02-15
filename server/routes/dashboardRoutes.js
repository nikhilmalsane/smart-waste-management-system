import express from "express"
import { getAdminDashboardStats, getStaffDashboardStats, getMapBins } from "../controllers/dashboardController.js"
import { protect } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/admin", protect, getAdminDashboardStats )
router.get("/staff", protect, getStaffDashboardStats)
router.get("/map-bins", protect, getMapBins)

export default router