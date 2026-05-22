import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { switchMap } from "rxjs";
import { JSEncrypt } from 'jsencrypt';

interface KeyResponse{
    publicKey: string;
}
interface LoginResponse{
  message: string,
  username: string
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);

    private url = 'http://localhost:8080';

    loginEncrypter (email: string, password: string){
        return this.http.get<KeyResponse>(`${this.url}/keys/public`)
            .pipe(switchMap((publicKeyResponse)=>{
                const encrypter = new JSEncrypt();
                encrypter.setPublicKey(publicKeyResponse.publicKey);
                const bodyEncrypted = encrypter.encrypt(email+':'+password);
                const jsonBody = {value: bodyEncrypted}
                if (!bodyEncrypted) throw new Error('No se pude encriptar los datos con la clave pública');
                return this.http.post<LoginResponse>(`${this.url}/users/login`,bodyEncrypted);
            })
        );
    }

    passwordEncrypter(password: string) {
        const credentials = localStorage.getItem('credentials');

        if (!credentials) {
            throw new Error('No credentials stored');
        }

        return this.http.get<KeyResponse>(`${this.url}/keys/public`)
            .pipe(switchMap((publicKeyResponse) => {
                const encrypter = new JSEncrypt();
                encrypter.setPublicKey(publicKeyResponse.publicKey);
                const bodyEncrypted = encrypter.encrypt(password);
                if (!bodyEncrypted) throw new Error('No se puede encriptar');
                const jsonBody = {
                    newPassword: bodyEncrypted,
                    credentialEncripted: credentials
                };
                return this.http.post(`${this.url}/users/change-password`,jsonBody);
            })
        );
    }
}