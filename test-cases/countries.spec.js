const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../app');
const apiKey = process.env.API_KEY;

const { expect } = chai;

chai.use(chaiHttp);

describe('GET /countries', function () {
  it('should return a list of countries', async function () {
    const countriesResponse = {
      response: {
        countries: [
          { 'iso-3166': 'US', name: 'United States' },
          { 'iso-3166': 'CA', name: 'Canada' }
        ]
      }
    };

    nock('https://calendarific.com')
      .get(`/api/v2/countries?api_key=${apiKey}`)
      .reply(200, countriesResponse);

    const res = await chai.request(app).get('/countries');
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('status').eql(200);
    expect(res.body).to.have.property('message').eql('Countries list fetched');
    expect(res.body).to.have.property('success').eql(true);
    expect(res.body.data).to.have.property('countries').that.deep.equals(countriesResponse.response.countries);
  });

  it('should handle errors from the external API', async function () {
    nock('https://calendarific.com')
      .get(`/api/v2/countries?api_key=${apiKey}`)
      .reply(500);

    const res = await chai.request(app).get('/countries');
    expect(res).to.have.status(500);
    expect(res.body).to.have.property('status').eql(500);
    expect(res.body).to.have.property('message').eql('An error occurred while fetching countries');
    expect(res.body).to.have.property('success').eql(false);
    expect(res.body.data).to.deep.equal({});
  });
});
