const express = require("express");
const {
  estimateFare,
  bookRide,
  getRide,
  getHistory,
  cancelRide,
} = require("../controllers/rideController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/estimate", protect, authorize("rider"), estimateFare);
router.post("/", protect, authorize("rider"), bookRide);
router.get("/history", protect, authorize("rider"), getHistory);
router.get("/:rideId", protect, getRide);
router.patch("/:rideId/cancel", protect, authorize("rider"), cancelRide);

module.exports = router;
