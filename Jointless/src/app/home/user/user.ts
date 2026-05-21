import { ChangeDetectionStrategy, inject, Component, OnInit , signal } from '@angular/core';
import { Title , Meta} from '@angular/platform-browser';
import { Router } from "@angular/router";
import { NgClass } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from '@angular/forms';

interface ChangePasswordResponse{
  success: boolean;
  message: string;
}

@Component({
  selector: 'user',
  imports: [NgClass, FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class User  implements OnInit{
  visible:boolean=true;
  changeType:boolean=true;
  
  viewPassword(){
    this.visible= !this.visible;
    this.changeType= !this.changeType;
  }
  
    private http = inject(HttpClient);
    private router = inject(Router); 
  
    errorMessage = signal('');
  
    passwordNew = signal('');
  
      sendValues(){
  
          if ( !this.passwordNew()){
            this.errorMessage.set("Completa todos los campos");
            return;
          }
  
          const body = {
            passwordNew: this.passwordNew()
          }
  
          this.http.post<ChangePasswordResponse>
            ('/users/change-password', body).subscribe({
              next: (response) => {
                alert("Contraseña cambiada correctamente")
                this.router.navigateByUrl('/home');
              }, error: (error)=>{
                if (error.status === 404)this.errorMessage.set('Usuario o contraseña incorrectos');
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
