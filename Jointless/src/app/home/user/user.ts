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
  userTouchedPassword = signal(false);
  
  viewPassword(){
    this.visible= !this.visible;
    this.changeType= !this.changeType;
  }
  
    private authService = inject(AuthService);
    private router = inject(Router); 
  
    message = signal<string>('');
    messageType = signal<'success' | 'error' | ''>('');
    passwordNew = signal('');
  
      sendValues(){
  
          if ( !this.passwordNew()){
            this.message.set("Completa todos los campos");
            return;
          }

          const passwordValue = this.passwordNew();
          if (passwordValue.length < 4) {
            this.message.set('La contraseña debe tener mínimo 4 caracteres');
            return;
          }
          if (!/\d/.test(passwordValue)) {
            this.message.set('La contraseña debe incluir 1 número');
            return;
          }
          this.message.set('');
          
        this.authService.passwordEncrypter(this.passwordNew()).subscribe({
          next: () =>{
            this.message.set("Contraseña cambiada correctamente");
            this.passwordNew.set('');
            this.userTouchedPassword.set(false);
            this.messageType.set('success');
          }, error: (error)=>{
            this.messageType.set('error');
            if (error.status === 400)this.message.set('La contraseña nueva es la misma que la antigua');
            else this.message.set('Error del servidor');
          }
        })
      }
  
    private title=inject(Title);
    private meta=inject(Meta);
  
    ngOnInit(): void {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigateByUrl('/login');
      }
      this.title.setTitle('User');
      this.meta.updateTag({name:'description',content:'Este es mi User'});
      this.meta.updateTag({name:'og:title',content:'User'});
      this.meta.updateTag({name:'keywords',content:'Jointless,Proyecto,Metrica,User'});
    }
}


