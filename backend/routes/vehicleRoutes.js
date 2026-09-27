const express = require("express");
const { registerVehicle, verifyVehicle } = require("../controllers/vehicleController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("driver"), registerVehicle);
router.patch("/:vehicleId/verify", protect, authorize("admin"), verifyVehicle);

module.exports = router;
