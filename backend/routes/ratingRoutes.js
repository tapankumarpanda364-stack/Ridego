const express = require("express");
const { rateRide } = require("../controllers/ratingController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("rider"), rateRide);

module.exports = router;
