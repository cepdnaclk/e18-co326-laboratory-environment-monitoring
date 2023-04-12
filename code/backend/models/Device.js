const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema for device
const deviceSchema = new Schema({
    pin: {
      type: String,
      required: true,
    },
    status: String,
    station: { type: Schema.Types.ObjectId, ref: "Station" },
  });
  
  // export model
  // here the first argument is the singular name of the collection
  module.exports = mongoose.model("Device", deviceSchema);