const router = require('express').Router();
const Clinic = require('../models/Clinic');
const Department = require('../models/Department');
const Doctor = require('../models/Doctor');

router.get('/clinics', async (req, res) => {
  const clinics = await Clinic.find().sort({ name: 1 });
  res.json(clinics);
});

router.get('/clinics/:clinicId/departments', async (req, res) => {
  const departments = await Department.find({ clinicId: req.params.clinicId }).sort({ name: 1 });
  res.json(departments);
});

router.get('/departments/:departmentId/doctors', async (req, res) => {
  const doctors = await Doctor.find({ departmentId: req.params.departmentId }).sort({ name: 1 });
  res.json(doctors);
});

module.exports = router;
