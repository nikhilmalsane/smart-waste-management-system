import express from "express"
import { getCollectionHistory } from "../controllers/collectionController.js"
import { protect, adminOnly } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/", protect, adminOnly, getCollectionHistory)

export default router