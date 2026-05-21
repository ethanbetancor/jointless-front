import { ChangeDetectionStrategy, inject, Component, OnInit , signal } from '@angular/core';
import { Title , Meta} from '@angular/platform-browser';
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { NgClass } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from '@angular/forms';

interface LoginResponse{
  success: boolean;
  message: string;
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

  private http = inject(HttpClient);
  private router = inject(Router); 

  errorMessage = signal('');

  password = signal('');
  email = signal('');

    sendValues(){
        
        if ( this.email.length==0 || this.password.length==0){
          this.errorMessage.set("Completa todos los campos");
          return;
        }

        const body = {
            email: this.email(),
            password: this.password()
        }

        console.log(body);

        this.http.post<LoginResponse>
          ('/users/login', body).subscribe({
            next: (response) => {
              if (response.success){
                this.router.navigateByUrl('/home');
              }else{
                this.errorMessage.set('Usuario o contraseña incorrectos');
              }
            }, error: ()=>{
              this.errorMessage.set('Error del servidor');
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
