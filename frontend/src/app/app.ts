import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class App implements OnInit {
  title = 'Build-Mate Chatbot';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Try to load API key from localStorage
    const savedApiKey = localStorage.getItem('claude_api_key');
    if (savedApiKey) {
      this.chatService.setApiKey(savedApiKey);
    }
  }
}
