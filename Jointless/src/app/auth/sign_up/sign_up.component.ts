import { HttpClient } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { JSEncrypt } from 'jsencrypt';

interface ResponseSucceed {
    token: string
}
interface PublicKey {
    publicKey: string
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
            this.http.get<PublicKey>('http://localhost:8080/api/v1/keys/public').subscribe({
                next: (key) => {
                    const encryptor = new JSEncrypt();
                    encryptor.setPublicKey(key.publicKey);
                    const body = {
                        username:this.username(),
                        email:this.email(),
                        encryptedPassword: encryptor.encrypt(this.password())
                    }
                    this.http.post<ResponseSucceed>('http://localhost:8080/api/v1/users/register', body).subscribe({
                        next: (response) => {

                            this.route.navigateByUrl('login');
                        },
                        error: (error) => {
                            if (error.status === 409) {
                                alert('Ese usuario ya está registrado');
                            }
                        }
                    });
                }

            });




        }
    }

    validateUsername(): boolean {
        if (this.username() == "") {
            this.usernameError.set('El username es obligatorio');
            return false;
        }

        if (this.username().includes(':')) {
            this.usernameError.set('El username no puede contener dos puntos ":"');
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

        if (this.email().includes(':')) {
            this.emailError.set('El email no puede contener dos puntos ":"');
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
        if (this.password().includes(':')) {
            this.passwordError.set('La contraseña no puede contener dos puntos ":"');
            return false;
        }
        if (passwordValue != this.confirmPasswd()) return false
        this.passwordError.set('');
        return true;
    }

    validateConfirmPassw() {
        const confPasswordValue = this.confirmPasswd();

        if (this.password() != "" && this.password() != confPasswordValue) {
            this.confirmPasswdError.set('Las contraseñas no coinciden');
            return false;
        }
        this.confirmPasswdError.set('');
        return true;
    }


}