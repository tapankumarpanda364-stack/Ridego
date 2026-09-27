const express = require("express");
const {
  setStatus,
  getRequests,
  acceptRide,
  completeRide,
  getEarnings,
} = require("../controllers/driverController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, authorize("driver"));

router.patch("/status", setStatus);
router.get("/requests", getRequests);
router.patch("/rides/:rideId/accept", acceptRide);
router.patch("/rides/:rideId/complete", completeRide);
router.get("/earnings", getEarnings);

module.exports = router;
