const express = require("express");
const { authenticateToken } = require("../auth/jwt");
const { sendData } = require("../mqtt_listener");
const Device = require("../models/Device");
const Station = require("../models/Station");

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /devices.
const router = express.Router();

// get station's overview data 
router.get("/station/overview", authenticateToken, (req, res) => {
  User.findById(req.user.user_id, function (err, user) {
    if (err || !user) {
      res.status(400).send("Error fetching user!");
    } else {
      let temperature, pressure, humidity, intensity;
      if (user.station.temperature === null || user.station.temperature === 0) {
        temperature : 0;
      }
	  if (user.station.pressure === null || user.station.pressure === 0) {
        pressure : 0;
      }
	  if (user.station.humidity === null || user.station.humidity === 0) {
        humidity : 0;
      }
	  if (user.station.intensity === null || user.station.intensity === 0) {
        intensity : 0;
      }
      }

      const overview = {
        temperature: temperature,
        humidity: humidity,
        pressure: pressure,
		intensity: intensity,
      };
      res.json(overview);
    }
  }).populate("station");
});

// sync station's data (sends a request to device to sync data)
router.post("/station/sync", authenticateToken, (req, res) => {
  sendData();
  res.status(200).json(null);
});

module.exports = router;
