import express from "express"
import { addBin, getAllBins, updateBinStatus, assignStaff, updateBin, deleteBin } from "../controllers/binController.js"
import protect from "../middlewares/authMiddleware.js"
import authorizeRoles from "../middlewares/roleMiddleware.js"
import Bin from "../models/Bin.js"

const router = express.Router()

router.get( "/", protect, getAllBins )
router.post( "/add", protect, authorizeRoles("admin"), addBin ) // protect : so only login users can add bin
router.put( "/update-status/:id", protect, updateBinStatus )
router.put( "/assign/:id", protect, authorizeRoles("admin"), assignStaff)  
router.put("/update/:id", protect, updateBin)
router.delete("/delete/:id", protect, deleteBin) 

router.get("/seed-bins", async (req, res) => {
  try {
    const baseLocations = [
      { area: "Shivajinagar", latitude: 18.5308, longitude: 73.8475 },
      { area: "Kothrud", latitude: 18.5074, longitude: 73.8077 },
      { area: "Hinjewadi", latitude: 18.5912, longitude: 73.7389 },
      { area: "Hadapsar", latitude: 18.5089, longitude: 73.9260 },
      { area: "Viman Nagar", latitude: 18.5679, longitude: 73.9143 }
    ]

    const bins = []

    for (let i = 1; i <= 50; i++) {
      const base = baseLocations[i % baseLocations.length]

      bins.push({
        binId: `BIN${i}`,
        location: `${base.area} - Spot ${i}`,

        // 👇 IMPORTANT (match your frontend)
        latitude: base.latitude + (Math.random() - 0.5) * 0.01,
        longitude: base.longitude + (Math.random() - 0.5) * 0.01,

        fillLevel: 0,
        status: "empty",
        assignedStaff: null
      })
    }

    await Bin.insertMany(bins)

    res.json({ message: "50 bins added for map view" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router  