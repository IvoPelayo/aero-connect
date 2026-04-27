import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavigationHistoryService } from '../../core/services/navigation-history.service';
import { GoBackDirective } from '../../shared/directive/go-back.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatButtonModule, MatIconModule, GoBackDirective],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  private _auth = inject(AuthService);
  navigationHistory = inject(NavigationHistoryService);
  isAuthenticated = this._auth.isAuthenticated;

  logout(): void {
    this._auth.logout();
  }
}
