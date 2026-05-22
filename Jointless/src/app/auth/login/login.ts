import { ChangeDetectionStrategy, inject, Component, OnInit , signal } from '@angular/core';
import { Title , Meta} from '@angular/platform-browser';
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { NgClass } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpClient } from "@angular/common/http";
import { switchMap } from "rxjs";
import { JSEncrypt } from 'jsencrypt';

interface KeyResponse{
    publicKey: string;
}

@Component({
  selector: 'login',
  imports: [RouterLink, RouterLinkActive, NgClass, FormsModule],
  templateUrl: 'login.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Login implements OnInit{

  visible:boolean=true;
  changeType:boolean=true;

  viewPassword(){
    this.visible= !this.visible;
    this.changeType= !this.changeType;
  }

  private router = inject(Router); 
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  private url = 'http://localhost:8080';

  errorMessage = signal('');

  password = signal('');
  email = signal('');

    sendValues(){

        if ( !this.email()|| !this.password()){
          this.errorMessage.set("Completa todos los campos");
          return;
        }

        this.authService.loginEncrypter(this.email(), this.password()).subscribe({
            next: (response) => {
              localStorage.setItem('username', response.username);
              this.http.get<KeyResponse>(`${this.url}/keys/public`)
                .subscribe({
                  next: (publicKeyResponse) => {
                    const encrypter = new JSEncrypt();
                    encrypter.setPublicKey(publicKeyResponse.publicKey);
                    const bodyEncrypted =
                      encrypter.encrypt(this.email() + ':' + this.password());
                    if (!bodyEncrypted) throw new Error('No se puede encriptar');
                    localStorage.setItem('credentials', bodyEncrypted);
                    alert(response.message);
                    this.router.navigateByUrl('/home');
                  }, error: () => {
                    this.errorMessage.set('Error obteniendo clave pública');
                  }
                });
            }, error: (error) => {
              if (error.status === 404) {
                this.errorMessage.set('Usuario o contraseña incorrectos');
              } else {
                this.errorMessage.set('Error del servidor');
              }
            }
          });
    }

  private title=inject(Title);
  private meta=inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Login');
    this.meta.updateTag({name:'description',content:'Este es mi Login'});
    this.meta.updateTag({name:'og:title',content:'Login'});
    this.meta.updateTag({name:'keywords',content:'Jointless,Proyecto,Metrica,Login'});
  }
}
