const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Clinic', clinicSchema);
