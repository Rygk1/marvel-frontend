import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

import { ImportsModule } from '../../../shared/components/imports';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService],
})
export class RegisterComponent {
  registerForm: FormGroup<{
    name: FormControl<string>;
    identification: FormControl<string>;
    email: FormControl<string>;
  }>;

  authService = inject(AuthService);

  constructor(
    private fb: NonNullableFormBuilder,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      name: this.fb.control('', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$'),
        ],
      }),
      identification: this.fb.control('', {
        validators: [Validators.required, Validators.pattern('^[0-9]*$')],
      }),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
      }),
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.getRawValue();
      this.authService.registerUser(formData).subscribe({
        next: (response) => {
          this.loadAlert('success', 'Todo salió bien!', response.message);
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
