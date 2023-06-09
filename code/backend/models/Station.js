const mongoose = require("mongoose"); // imports mongoose
const Schema = mongoose.Schema; // defines the strcuture of documents inside a collection

const stationSchema = new Schema({
  temperature: {
    type: Number,
    required: true
  },

  pressure: {
    type: Number,
    required: true
  },

  humidity: {
    type: Number,
    required: true
  },

  intensity: {
    type: Number,
    required: true
  },
  
});

module.exports = mongoose.model("Station", stationSchema);
