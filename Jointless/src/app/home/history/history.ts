import { ChangeDetectionStrategy, inject, Component, OnInit, computed, signal } from '@angular/core';
import { Title , Meta} from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from '../../auth/auth.service';
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

@Component({
  selector: 'history',
  imports: [],
  templateUrl: './history.html',
  styleUrl: './history.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class History implements OnInit{
  private http = inject(HttpClient);
  private url = 'http://localhost:8080';
  titleExercise = signal('');
  private authService = inject(AuthService);
  exercises = signal<ListSolutions>({
    listSolutions: []
  });
  completed = computed<ListSolutions>(()=>{
    const list = this.exercises();
    if (list.listSolutions.length===0)return {
      listSolutions: []
    };
    return list;
  });
  getSignal(): string{
    let result=this.titleExercise();
    return result;
  }
  getTitle(id:number){
    this.authService.getLevel(id).subscribe({
      next: (response) =>{
        this.titleExercise.set(response.level.title);
      }, error: (error)=>{
        if (error.status === 404)alert('Ejercicio no accesible');
        alert('Error del servidor');
      }
    })
  }
  private title=inject(Title);
  private meta=inject(Meta);
  ngOnInit(): void {
      const token = localStorage.getItem('token');
  
      if (!token) {
        throw new Error('No token stored');
      }
      const headers = new HttpHeaders({
        authorization: `Bearer ${token}`
      });
      this.http.post<ListSolutions>(`${this.url}/api/v1/solutions/user`,{},{headers}).subscribe({
        next: (response: ListSolutions)=>{
          this.exercises.set(response);   
        }, error: (error)=>{
          if (error.status === 404)alert('Ejercicio no accesible');
          alert('Error del servidor');
        }
      })
      this.title.setTitle('Home');
      this.meta.updateTag({name:'description',content:'Este es mi Home'});
      this.meta.updateTag({name:'og:title',content:'Home'});
      this.meta.updateTag({name:'keywords',content:'Jointless,Proyecto,Metrica,Home'});
    }
}
