const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');
const professionalRoutes = require('./routes/professionalRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appointment-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/professionals', professionalRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Appointment & Scheduling System API',
    version: '1.0.0',
    endpoints: {
      auth: {
        requestOTP: 'POST /api/auth/request-otp',
        verifyOTP: 'POST /api/auth/verify-otp'
      },
      appointments: {
        book: 'POST /api/appointments/book',
        reschedule: 'PUT /api/appointments/reschedule',
        cancel: 'DELETE /api/appointments/cancel',
        schedule: 'GET /api/appointments/schedule'
      },
      professionals: {
        create: 'POST /api/professionals',
        addSchedule: 'POST /api/professionals/:id/schedule',
        getAll: 'GET /api/professionals',
        getById: 'GET /api/professionals/:id'
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;