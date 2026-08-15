const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['consultation', 'analysis'], default: 'consultation' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', departmentSchema);
