import express from 'express';
import axios from 'axios';

const app = express();

app.use(express.json());

app.get('/uptime', async (req: express.Request, res: express.Response) => {
  const animee_core = await checkAvailability('http://api.animee.club:8080/v1/uptime');
  const mongodb = await checkAvailability('http://api.animee.club:27017/');
  const mongoui = await checkAvailability('http://api.animee.club:8081/');
  const animee = await checkAvailability('http://animee.club/');

  return res.status(200).json({
    animee_core,
    mongodb,
    mongoui,
    animee
  });
});

async function checkAvailability(url: string): Promise<boolean> {
  try {
    const response = await axios.get(url, {
      timeout: 3000,
      validateStatus(status) {
        if (status > 500 || status === 404) {
          return false;
        }

        return true;
      },
    });

    return true;
  } catch (e) {
    return false;
  }
}

app.listen(54319, '0.0.0.0', () => {
  console.log('Listening on 0.0.0.0:54319 ...');
});