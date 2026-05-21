import { HttpClient } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";

interface ResponseSucceed{
    success: boolean,
    message: string
}


@Component({
    templateUrl: 'sign_up.component.html',
    imports: [FormsModule],
})

export class SignUpComponent {

    username = signal('');
    password = signal('');
    confirmPasswd = signal('');
    email = signal('');

    passwordError = signal('');
    usernameError = signal('');
    emailError = signal('');
    confirmPasswdError = signal('');

    private http = inject(HttpClient);
    private route = inject(Router);

    sendValues() {
        const validPassword = this.validatePassword();
        const validEmail = this.validateEmail();
        const validUsername = this.validateUsername();
        const validConfPassw = this.validateConfirmPassw();

        if (validPassword && validEmail && validUsername && validConfPassw) {
            const body = {
                user: this.username(),
                passw: this.password(),
                email: this.email()
            }

            console.log(body);

            this.http.post<ResponseSucceed>('/register', body).subscribe({
                next: (response) => { 
                    alert('Usuario registrado correctamente');
                    this.route.navigateByUrl('../login/login.ts');
                },
                error: (error) => {
                    if (error.status === 409) {
                    alert('Ese usuario ya está registrado');
                    }
                }
            });
        }
    }

    validateUsername(): boolean {
        if (this.username() == "") {
            this.usernameError.set('El username es obligatorio');
            return false;
        }
        this.usernameError.set('');
        return true
    }

    validateEmail(): boolean {
        const emailValue = this.email().trim();

        if (emailValue === '') {
            this.emailError.set('El email es obligatorio');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
            this.emailError.set('Introduce un email válido');
            return false;
        }

        this.emailError.set('');
        return true;
    }
    
    validatePassword(): boolean {
        const passwordValue = this.password();
        if (passwordValue.length < 4) {
            this.passwordError.set('La contraseña debe tener mínimo 4 caracteres');
            return false;
        }

        if (!/\d/.test(passwordValue)) {
            this.passwordError.set('La contraseña debe incluir 1 número');
            return false;
        }
        if(passwordValue!=this.confirmPasswd()) return false
        this.passwordError.set('');
        return true;
    }

    validateConfirmPassw(){
        const confPasswordValue = this.confirmPasswd();

        if(this.password()!=""&&this.password()!=confPasswordValue){
            this.confirmPasswdError.set('Las contraseñas no coinciden');
            return false;
        }
        this.confirmPasswdError.set('');
        return true;
    }
    
    
}