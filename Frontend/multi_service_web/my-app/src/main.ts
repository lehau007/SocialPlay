import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { ToastComponent } from './components/toast/toast.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(CommonModule, FormsModule)
  ]
}).then(() => {
  // Add toast component to the root
  const toastElement = document.createElement('app-toast');
  document.body.appendChild(toastElement);
}).catch(err => console.error(err));