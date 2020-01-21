import express from 'express';
import hitsRouter from './hits';
import contributionRouter from './contribution';

const app = express();

app.use('/hits', hitsRouter);
app.use('/contribution', contributionRouter);

export function runServer(host: string, port: number) {
  return new Promise((resolve, reject) => {
    app.listen(port, host, (err: any) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
