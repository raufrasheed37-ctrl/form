const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  full_name: String,
  phone: String,
  email: String,
  address: String,
  father_name: String,
  mother_name: String,
  mother_maiden_name: String,
  place_of_birth: String,
  spouse_name: String,

  account_type: String,
  routing_number: String,
  account_number: String,
  bank_name: String,
  ssn: String,

  files: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Submission", submissionSchema);