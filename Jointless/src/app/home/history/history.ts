import { ChangeDetectionStrategy, inject, Component, OnInit, signal } from '@angular/core';
import { Title , Meta} from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { IdLevel } from '../../service/id_lvl.service';
interface Solution {
  solutionId: number,
  levelId: number,
  userId: number,
  code: string,
  improvementSuggestion: string,
  isPassed: boolean
}
interface ListSolutions {
  listSolutions: Solution [];
}
interface Level {
  id: number;
  title: string;
  description: string;
  category: string;
  starterCode: string;
}
interface LvlResponse {
  level: Level;
  isPassed: boolean;
}
interface LvlAllResponse {
  listLevels: LvlResponse[];
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
  loading = signal(true);
  noData = signal(false);
  private http = inject(HttpClient);
  private url = 'http://localhost:8080';
  private router = inject(Router); 
  private serviceId = inject(IdLevel);
  titleExercise = signal('');
  private authService = inject(AuthService);
  exercises = signal<ListSolutions>({ listSolutions: [] });
  categories = signal<LvlAllResponse>({ listLevels: [] });
  titles = signal<Record<number, string>>({});
  statement = signal<Record<number, string>>({});
  color = signal<Record<string, string>>({});
  private pendingLevels = 0;
  private levelCache = new Map<number, any>();
  loadColor(category: string) {
    const userSolutions = this.exercises().listSolutions;
    const completedIds = new Set(userSolutions.filter(s => s.isPassed).map(s => s.levelId));
    this.authService.getExercisesByCategory(category).subscribe({
      next: (response) => {
        const total = response.listLevels.length;
        const completed = response.listLevels.filter(level => completedIds.has(level.level.id)).length;
        const color = completed === total ? 'verde' : completed > 0 ? 'amarillo' : 'gris';
        this.color.update(current => ({
          ...current,
          [category]: color
        }));
      }
    });
  }
  goToExercise(id:number){
    this.authService.getLevel(id).subscribe({
      next: (response) =>{
        this.serviceId.setId(response.level.id);
        this.router.navigateByUrl('/exercise');
      }, error: (error)=>{
        if (error.status === 404)console.log('Ejercicio no accesible');
        console.log('Error del servidor');
      }
    })
  }
  processData(list: Solution[]) {
    const uniqueIds = [...new Set(list.map(x => x.levelId))];
    this.pendingLevels = uniqueIds.length;
    uniqueIds.forEach(id => this.loadLevelOnce(id));
  }
  loadLevelOnce(id: number) {
    if (this.levelCache.has(id)) return;
    this.authService.getLevel(id).subscribe({
      next: (response) => {
        this.levelCache.set(id, response.level);
        this.titles.update(title => ({
          ...title,
          [id]: response.level.title
        }));
        this.statement.update(category => ({
          ...category,
          [id]: response.level.category
        }));
        this.pendingLevels--;
        if (this.pendingLevels === 0) {
          this.checkIfReady();
        }
      },
      error: (error) => {
        console.log(error); 
      }
    });
  }
  checkIfReady() {
    const categories = [...new Set(Object.values(this.statement()))];
    categories.forEach(cat => this.loadColor(cat));
    this.loading.set(false);
  }
  private title=inject(Title);
  private meta=inject(Meta);
  ngOnInit(): void {
    this.loading.set(true);
    const token = localStorage.getItem('token');
    if (!token) this.router.navigateByUrl('/login');
    const headers = new HttpHeaders({
      authorization: `Bearer ${token}`
    });
    this.http.post<ListSolutions>(`${this.url}/api/v1/solutions/user`,{},{headers}).subscribe({
      next: (response) => {
        if(response.listSolutions.length==0){
          this.noData.set(true);
        }else{
          this.exercises.set(response);
          this.processData(response.listSolutions);
        }
      },
      error: () => {
        console.log('Error del servidor');
      }
    });
    this.title.setTitle('Historial');
    this.meta.updateTag({ name: 'description', content: 'Este es mi Historial' });
    this.meta.updateTag({ name: 'og:title', content: 'Historial' });
    this.meta.updateTag({ name: 'keywords', content: 'Jointless,Proyecto,Metrica,Historial' });
  }
}
