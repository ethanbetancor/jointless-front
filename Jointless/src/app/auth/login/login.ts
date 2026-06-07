import { ChangeDetectionStrategy, inject, Component, OnInit , signal } from '@angular/core';
import { Title , Meta} from '@angular/platform-browser';
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { NgClass } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';


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
              localStorage.setItem('token', response.token);
              this.router.navigateByUrl('/home');
            }, error: (error) => {
              if (error.status === 404) {
                this.errorMessage.set('Usuario o contraseña incorrectos');
              } else if(error.status === 403) {
                this.errorMessage.set('Hay que validar el usuario en el correo para hacer login');
              }else{
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
