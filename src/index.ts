import { runServer } from './server';

const PORT = Number(process.env.PORT) || 5050; // default port
const HOST = process.env.HOST || 'localhost'; // localhost

async function startApplication() {
  try {
    // tslint:disable-next-line:no-console
    await runServer(HOST, PORT);
    // tslint:disable-next-line:no-console
    console.log(`server is running on http://${HOST}:${PORT}`);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e);
    throw e;
  }
}

startApplication();
