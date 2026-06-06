import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { switchMap } from "rxjs";
import { JSEncrypt } from 'jsencrypt';

interface KeyResponse{
    publicKey: string;
}
interface LoginResponse{
  token: string,
  username: string
}
interface LvlResponse{ 
  level: {
    id: number,
    title: string,
    description: string,
    category: string,
    starterCode: string
  },
  isPassed: true
}
interface LvlAllResponse {
  listLevels: LvlResponse[];
}
interface Solution {
  solutionId: number,
  levelId: number,
  userId: number,
  code: string,
  isPassed: true
}

interface ListSolutions {
  listSolutions: Solution [];
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);

    private url = 'http://localhost:8080';
    // http://jointless-back-production.up.railway.app

    loginEncrypter (email: string, password: string){
        return this.http.get<KeyResponse>(`${this.url}/api/v1/keys/public`)
            .pipe(switchMap((publicKeyResponse)=>{
                const encrypter = new JSEncrypt();
                encrypter.setPublicKey(publicKeyResponse.publicKey);
                const bodyEncrypted = encrypter.encrypt(password);
                const jsonBody = {email: email, encryptedPassword: bodyEncrypted}
                if (!bodyEncrypted) throw new Error('No se pude encriptar los datos con la clave pública');             
                return this.http.post<LoginResponse>(`${this.url}/api/v1/users/login`,jsonBody);
            })
        );
    }

    passwordEncrypter(password: string) {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token stored');
        }

        return this.http.get<KeyResponse>(`${this.url}/api/v1/keys/public`)
            .pipe(switchMap((publicKeyResponse) => {
                const encrypter = new JSEncrypt();
                encrypter.setPublicKey(publicKeyResponse.publicKey);
                const bodyEncrypted = encrypter.encrypt(password);
                if (!bodyEncrypted) throw new Error('No se puede encriptar');
                const jsonBody = {
                    newPassword: bodyEncrypted
                };
                const headers = new HttpHeaders({
                    authorization: `Bearer ${token}`
                });
                return this.http.post(`${this.url}/api/v1/users/change-password`,jsonBody,{headers});
            })
        );
    }

    getLevel(id: number) {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token stored');
        }
        const jsonBody = {
            id: id
        };
        const headers = new HttpHeaders({
            authorization: `Bearer ${token}`
        });
        return this.http.post<LvlResponse>(`${this.url}/api/v1/lvl/get`,jsonBody,{headers});
    }
    getExercisesByCategory(category: string) {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token stored');
        }
        const jsonBody = {
            category: category
        };
        const headers = new HttpHeaders({
            authorization: `Bearer ${token}`
        });
        return this.http.post<LvlAllResponse>(`${this.url}/api/v1/lvl/get/category`,jsonBody,{headers});
    }

}