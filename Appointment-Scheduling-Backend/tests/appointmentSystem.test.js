const request = require('supertest');
const app = require('../src/server');
const mongoose = require('mongoose');
const { Professional } = require('../src/models/AppointmentModels');

describe('Appointment Scheduling System', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/appointment-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Professional.deleteMany({});
  });

  test('should create a professional', async () => {
    const response = await request(app)
      .post('/api/professionals')
      .send({
        name: 'Dr. John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        specialty: 'Cardiology'
      })
      .expect(201);

    expect(response.body.message).toBe('Professional created successfully');
    expect(response.body.professional.name).toBe('Dr. John Doe');
  });

  test('should get all professionals', async () => {
    await request(app)
      .post('/api/professionals')
      .send({
        name: 'Dr. Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567891',
        specialty: 'Dermatology'
      });

    const response = await request(app)
      .get('/api/professionals')
      .expect(200);

    expect(response.body.professionals.length).toBe(1);
    expect(response.body.professionals[0].name).toBe('Dr. Jane Smith');
  });

  test('should return API information', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body.message).toBe('Appointment & Scheduling System API');
    expect(response.body.endpoints).toBeDefined();
  });
});