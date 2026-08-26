import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly router = inject(Router);
  private readonly url = signal(this.router.url);
  protected readonly isFloor = computed(() => this.url().startsWith('/q/'));
  constructor() { this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => this.url.set(this.router.url)); }
}
