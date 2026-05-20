import { HttpClient } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";


@Component({
    templateUrl: 'sign_up.component.html',
    styleUrl: '../login/login.css'
})

export class SignUpComponent{
    username = signal('');
    password = signal('');
    confirmPasswd = signal('');
    email = signal('');

    private http = inject(HttpClient);

    sendValues(){
        const body = {
            user: this.username(),
            passw: this.password(),
            cPassw: this.confirmPasswd(),
            email: this.email()
        }

        console.log(body);

        this.http.post('/register', body).subscribe({
            next: (response) => {console.log(response)}
        });
    }
}