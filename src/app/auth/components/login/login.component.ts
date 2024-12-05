import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ImportsModule } from '../../../shared/components/imports';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ImportsModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
})
export class LoginComponent {
  loginForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  authService = inject(AuthService);
  router = inject(Router);

  constructor(
    private fb: NonNullableFormBuilder,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.getRawValue();
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loadAlert('success', 'Logueado correctamente', response.message);
          this.router.navigate(['/user/comics']);
        },
        error: (error) => {
          this.loadAlert('error', 'error', error.error.message);
        },
      });
    } else {
      this.loadAlert('warning', 'warning', 'Formulario invalido');
    }
  }

  loadAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity,
      summary,
      detail,
    });
  }
}
