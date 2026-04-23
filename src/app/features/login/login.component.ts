import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private _auth = inject(AuthService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  email = '';
  pnr = '';
  error = '';

  login(): void {
    if (!this.email || !this.pnr) {
      this.error = 'Rellena todos los campos.';
      return;
    }
    this._auth.login({ email: this.email, pnr: this.pnr });
    const returnUrl = this._route.snapshot.queryParams['returnUrl'] ?? '/';
    this._router.navigateByUrl(returnUrl);
  }
}
