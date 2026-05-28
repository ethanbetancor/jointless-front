import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
// comentar dede aqui
const { worker } = await import('./mocks/browser');

await worker.start({
 serviceWorker: {
   url: '/mockServiceWorker.js'
 }
});
// hasta aqui

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));


