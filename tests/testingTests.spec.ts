import * as Jest from 'ts-jest';

const request = require('supertest');
const express = require('express');

const app = express();

app.get('/user', function(req, res) {
  res.status(200).json({ name: 'john' });
});

test('call', () => {
  request(app)
    .get('/user')
    .expect('Content-Type', /json/)
    .expect('Content-Length', '15')
    .expect(200)
    .end(function(err, res) {
      if (err) throw err;
    });
});




test('adds 1 + 2 to equal 3', () => {



  expect(1 + 2).toBe(3);
});

test('adds 1 + 2 to equal 3 (2)', () => {
  expect(1 + 4).toBe(5);
});
