require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./src/config/db');
const Clinic = require('./src/models/Clinic');
const Department = require('./src/models/Department');
const Doctor = require('./src/models/Doctor');
const User = require('./src/models/User');

async function seed() {
  await connectDB();

  await Promise.all([
    Clinic.deleteMany({}),
    Department.deleteMany({}),
    Doctor.deleteMany({}),
    User.deleteMany({ role: 'doctor' }),
  ]);

  const clinic = await Clinic.create({
    name: 'Toshkent Tibbiyot Markazi',
    address: 'Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko\'chasi 12',
  });

  const departments = await Department.insertMany([
    { clinicId: clinic._id, name: 'LOR (quloq-burun-tomoq)', type: 'consultation' },
    { clinicId: clinic._id, name: 'Kardiolog', type: 'consultation' },
    { clinicId: clinic._id, name: 'Terapevt', type: 'consultation' },
    { clinicId: clinic._id, name: 'Umumiy qon tahlili', type: 'analysis' },
    { clinicId: clinic._id, name: 'Biokimyoviy tahlil', type: 'analysis' },
  ]);

  const passwordHash = await bcrypt.hash('doctor123', 10);

  const doctorDefs = [
    { name: 'Dr. Alisher Karimov', deptIndex: 0 },
    { name: 'Dr. Nodira Yusupova', deptIndex: 1 },
    { name: 'Dr. Bekzod Toshev', deptIndex: 2 },
  ];

  for (const [i, d] of doctorDefs.entries()) {
    const user = await User.create({
      name: d.name,
      phone: `+99890000000${i + 1}`,
      passwordHash,
      role: 'doctor',
    });
    await Doctor.create({
      userId: user._id,
      clinicId: clinic._id,
      departmentId: departments[d.deptIndex]._id,
      name: d.name,
    });
    console.log(`[seed] Shifokor: ${d.name} — tel: +99890000000${i + 1} / parol: doctor123`);
  }

  console.log('[seed] Tayyor. Klinika:', clinic.name);
  console.log('[seed] Bo\'limlar:', departments.map((d) => d.name).join(', '));
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
