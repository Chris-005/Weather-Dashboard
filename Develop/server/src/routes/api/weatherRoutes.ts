import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { city } = req.body;
  const weather = await WeatherService.getWeatherForCity(city);
  res.json(weather);
  // TODO: GET weather data from city name
  router.get('/', async (req, res) => {
    const city: string = req.query.city as string;
    const weather = await WeatherService.getWeatherForCity(city);
    res.json(weather);
  });
    // TODO: save city to search history
    router.post('/', async (req, res) => {
      const { city } = req.body;
      const history = await HistoryService.addCity(city);
      res.json(history);
    });
  });

  // TODO: GET search history
  router.get('/history', async (_req, _res) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req, _res) => {});

export default router;
