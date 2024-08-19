const express = require("express");
const calenderificController = require("../Controllers/calenderificControllers");
const router = express.Router();


router.get("/holidays", calenderificController.holidays);
router.get("/countries", calenderificController.countries);

module.exports = router;
