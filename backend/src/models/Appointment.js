const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    queueNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'called', 'done', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ departmentId: 1, date: 1, queueNumber: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
