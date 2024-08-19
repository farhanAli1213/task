const axios = require('axios');
const apiKey = process.env.API_KEY;
const catchAsync = require("../Utils/catchAsync");
const AppErr = require("../Utils/appError");
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

exports.holidays = catchAsync(async (req, res, next) => {
  const { country, year } = req.query;

  if (!country || !year) {
    return next(new AppErr('Country and year are required', 400));
  }

  const cacheKey = `${country}-${year}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('Returning cached data');
    return res.status(200).json({
      status: 200,
      message: 'Holidays fetched from cache',
      success: true,
      data: cachedData,
    });
  }

  try {
    const supportedCountriesUrl = `https://calendarific.com/api/v2/countries?api_key=${apiKey}`;
    const supportedCountriesResponse = await axios.get(supportedCountriesUrl);
    const supportedCountries = supportedCountriesResponse.data.response.countries;

    // Check if the country is supported
    const isCountrySupported = supportedCountries.some(c => c['iso-3166'] === country);
    if (!isCountrySupported) {
      return next(new AppErr('Country not supported', 400));
    }


    const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}`;
    const response = await axios.get(url);

    const holidays = response.data.response.holidays;

    // Cache the response data
    cache.set(cacheKey, holidays);

    res.status(200).json({
      status: 200,
      message: 'Holidays fetched',
      success: true,
      data: holidays,
    });
  } catch (error) {
    console.error('Error fetching holidays:', error);
    res.status(500).json({
      status: 500,
      message: 'An error occurred while fetching holidays',
      success: false,
      data: {},
    });
  }
});

exports.countries = catchAsync(async (req, res) => {
  try {
    const url = `https://calendarific.com/api/v2/countries?api_key=${apiKey}`;
    const response = await axios.get(url);
    let countries = response.data.response.countries

    res.status(200).json({
      status: 200,
      message: "Countries list fetched",
      success: true,
      data: { countries },
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      status: 500,
      message: "An error occurred while fetching countries",
      success: false,
      data: {},
    });
  }
});
