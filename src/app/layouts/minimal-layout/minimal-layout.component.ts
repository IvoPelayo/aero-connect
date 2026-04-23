import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-minimal-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="minimal-layout">
      <router-outlet />
    </div>
  `,
  styles: [`
    .minimal-layout {
      min-height: 100vh;
      background: var(--color-bg);
    }
  `]
})
export class MinimalLayoutComponent {}
