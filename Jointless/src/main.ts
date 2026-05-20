import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const { worker } = await import('./mocks/browser');

await worker.start({
  serviceWorker: {
    url: '/mockServiceWorker.js'
  }
});


bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));


