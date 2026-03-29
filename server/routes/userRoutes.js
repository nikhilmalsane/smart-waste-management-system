import express from "express"
import protect from "../middlewares/authMiddleware.js"
import { approveStaff, getPendingStaffRequest, rejectStaff, updateAvailability } from "../controllers/userController.js"
import authorizeRoles from "../middlewares/roleMiddleware.js"

const router = express.Router()

router.put("/availability/:id", protect, updateAvailability )
router.get("/staff-requests", protect, authorizeRoles("admin"), getPendingStaffRequest)
router.put("/staff-approve/:id", protect, authorizeRoles("admin"), approveStaff)
router.delete("/staff-reject/:id", protect, authorizeRoles("admin"), rejectStaff)

export default router    