import express from "express"
import { addBin, getAllBins, updateBinStatus, assignStaff } from "../controllers/binController.js"
import protect from "../middlewares/authMiddleware.js"
import authorizeRoles from "../middlewares/roleMiddleware.js"

const router = express.Router()

router.get( "/", protect, getAllBins )
router.post( "/add", protect, authorizeRoles("admin"), addBin ) // protect : so only login users can add bin
router.put( "/update-status/:id", protect, updateBinStatus )
router.put( "/assign/:id", protect, assignStaff)

export default router