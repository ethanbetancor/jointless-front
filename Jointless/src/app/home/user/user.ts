import { ChangeDetectionStrategy, inject, Component, OnInit , signal } from '@angular/core';
import { Title , Meta} from '@angular/platform-browser';
import { Router } from "@angular/router";
import { NgClass } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

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
  
    private authService = inject(AuthService);
    private router = inject(Router); 
  
    errorMessage = signal('');
  
    passwordNew = signal('');
  
      sendValues(){
  
          if ( !this.passwordNew()){
            this.errorMessage.set("Completa todos los campos");
            return;
          }

          const passwordValue = this.passwordNew();
          if (passwordValue.length < 4) {
              this.errorMessage.set('La contraseña debe tener mínimo 4 caracteres');
              return;
          }
          if (!/\d/.test(passwordValue)) {
              this.errorMessage.set('La contraseña debe incluir 1 número');
              return;
          }
          this.errorMessage.set('');
          
        this.authService.passwordEncrypter(this.passwordNew()).subscribe({
          next: (response) =>{
            alert("Contraseña cambiada correctamente");
            this.router.navigateByUrl('/home');
          }, error: (error)=>{
            if (error.status === 404)this.errorMessage.set('La contraseña nueva es la misma que la antigua');
            this.errorMessage.set('Error del servidor');
          }
        })
      }
  
    private title=inject(Title);
    private meta=inject(Meta);
  
    ngOnInit(): void {
      this.title.setTitle('User');
      this.meta.updateTag({name:'description',content:'Este es mi User'});
      this.meta.updateTag({name:'og:title',content:'User'});
      this.meta.updateTag({name:'keywords',content:'Jointless,Proyecto,Metrica,User'});
    }
}
