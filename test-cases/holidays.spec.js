const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../app'); 
const apiKey = process.env.API_KEY;
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

const { expect } = chai;

chai.use(chaiHttp);

describe('GET /holidays', function () {
  beforeEach(() => {
    // Setup the cache before each test
    cache.flushAll(); // Correct method to clear all entries
  });

  it('should return 400 if country or year is missing', async function () {
    const res = await chai.request(app).get('/holidays?country=US');
    expect(res).to.have.status(400);
    expect(res.body).to.have.property('message').eql('Country and year are required');
  });

  // it('should return cached data if available', async function () {
  //   const cacheKey = 'US-2024';
  //   const cachedResponse = [{ name: 'New Year\'s Day', date: '2024-01-01' }];
  //   cache.set(cacheKey, cachedResponse);

  //   const res = await chai.request(app).get(`/holidays?country=US&year=2024`);
  //   expect(res).to.have.status(200);
  //   expect(res.body).to.have.property('message').eql('Holidays fetched from cache');
  //   expect(res.body.data).to.deep.equal(cachedResponse);
  // });

  // it('should return 400 if the country is not supported', async function () {
  //   const scope = nock('https://calendarific.com')
  //     .get(`/api/v2/countries?api_key=${apiKey}`)
  //     .reply(200, { response: { countries: [] } });

  //   const res = await chai.request(app).get(`/holidays?country=ZZ&year=2024`);
  //   expect(res).to.have.status(400);
  //   expect(res.body).to.have.property('message').eql('Country not supported');
  // });

  // it('should return holidays data and cache it', async function () {
  //   const holidaysResponse = { response: { holidays: [{ name: 'Christmas Day', date: '2024-12-25' }] } };

  //   nock('https://calendarific.com')
  //     .get(`/api/v2/countries?api_key=${apiKey}`)
  //     .reply(200, { response: { countries: [{ 'iso-3166': 'US' }] } });

  //   nock('https://calendarific.com')
  //     .get(`/api/v2/holidays?api_key=${apiKey}&country=US&year=2024`)
  //     .reply(200, holidaysResponse);

  //   const res = await chai.request(app).get(`/holidays?country=US&year=2024`);
  //   expect(res).to.have.status(200);
  //   expect(res.body).to.have.property('message').eql('Holidays fetched');
  //   expect(res.body.data).to.deep.equal(holidaysResponse.response.holidays);

  //   // Verify caching
  //   const cacheKey = 'US-2024';
  //   const cachedData = cache.get(cacheKey);
  //   expect(cachedData).to.deep.equal(holidaysResponse.response.holidays);
  // });

  // it('should handle errors from the external API', async function () {
  //   nock('https://calendarific.com')
  //     .get(`/api/v2/countries?api_key=${apiKey}`)
  //     .reply(500);

  //   const res = await chai.request(app).get(`/holidays?country=US&year=2024`);
  //   expect(res).to.have.status(500);
  //   expect(res.body).to.have.property('message').eql('An error occurred while fetching holidays');
  // });
});
