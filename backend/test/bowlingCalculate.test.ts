import app from '../src/app';
import request from 'supertest';
import { resetGame } from '../src/controller/bowlingController';

beforeAll(() => {
  resetGame();
});

const strike = {
  rolls: [[10], [2, 8], [4, 0]], // frame1: 14, frame2: 18
};

const spare = {
  rolls: [[9, 1], [2, 2]], // frame1: 12, frame2: 16
};

const normal = {
  rolls: [[2, 2], [2, 2]], // frame1: 4, frame2: 8
};

const perfect = {
  rolls: [[10], [10], [10], [10], [10], [10], [10], [10], [10], [10, 10, 10]]
};

describe('POST api/bowling/calculate', () => {
  it('Strike on first roll', () =>
    request(app)
      .post('/api/bowling/calculate')
      .set('Accept', 'application/json')
      .send(strike)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
       expect(response.body[response.body.length-1]).toBe(38);
      }));
});

describe('POST api/bowling/calculate', () => {
  it('Spare on first roll', () =>
    request(app)
      .post('/api/bowling/calculate')
      .set('Accept', 'application/json')
      .send(spare)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body[response.body.length-1]).toBe(16);
      }));
});

describe('POST api/bowling/calculate', () => {
  it('normal run', () =>
    request(app)
      .post('/api/bowling/calculate')
      .set('Accept', 'application/json')
      .send(normal)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body[response.body.length-1]).toBe(8);
      }));
});

describe('POST api/bowling/calculate', () => {
  it('perfect game', () =>
    request(app)
      .post('/api/bowling/calculate')
      .set('Accept', 'application/json')
      .send(perfect)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body[response.body.length-1]).toBe(300);
      }));
});