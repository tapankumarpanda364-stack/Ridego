const express = require("express");
const { getPaymentForRide, updatePaymentMethod } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:rideId", protect, getPaymentForRide);
router.patch("/:rideId", protect, updatePaymentMethod);

module.exports = router;
