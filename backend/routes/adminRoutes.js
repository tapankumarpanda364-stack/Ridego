const express = require("express");
const { listUsers } = require("../controllers/userController");
const { listDrivers } = require("../controllers/driverController");
const { listVehicles } = require("../controllers/vehicleController");
const { listRides } = require("../controllers/rideController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/users", listUsers);
router.get("/drivers", listDrivers);
router.get("/vehicles", listVehicles);
router.get("/rides", listRides);

module.exports = router;
