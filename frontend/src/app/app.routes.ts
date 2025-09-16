import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat.component';
import { ApiKeySetupComponent } from './components/api-key-setup.component';
import { DebugComponent } from './components/debug.component';

export const routes: Routes = [
  { path: '', redirectTo: '/setup', pathMatch: 'full' },
  { path: 'setup', component: ApiKeySetupComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'debug', component: DebugComponent },
  { path: '**', redirectTo: '/setup' }
];
