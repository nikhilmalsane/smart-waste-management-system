import express from "express"
import { addStaff, updateStaff, deleteStaff, getAllStaff } from "../controllers/adminController.js"
import protect from "../middlewares/authMiddleware.js"
import authorizeRoles from "../middlewares/roleMiddleware.js"

const router = express.Router()

router.post("/add", protect, authorizeRoles("admin"), addStaff)
router.put("/update/:id", protect, authorizeRoles("admin"), updateStaff)
router.delete("/delete/:id", protect, authorizeRoles("admin"), deleteStaff)
router.get("/", protect, authorizeRoles("admin"), getAllStaff)

export default router    