import { ChangeDetectionStrategy, inject, Component, OnInit, effect, signal } from '@angular/core';
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
  titlesEffect = effect(() => {
    const list = this.exercises().listSolutions;
    if (!list.length) return;
    const uniqueIds = [...new Set(list.map(x => x.levelId))];
    uniqueIds.forEach(id => {
      if (!this.titles()[id]) {
        this.loadTitle(id);
      }
    });
  });
  loadTitle(id: number) {
    this.authService.getLevel(id).subscribe({
      next: (response) => {
        this.titles.update(current => ({
          ...current,
          [id]: response.level.title
        }));
      }
    });
  }
  statementEffect = effect(() => {
    const list = this.exercises().listSolutions;
    if (!list.length) return;
    const uniqueIds = [...new Set(list.map(x => x.levelId))];
    uniqueIds.forEach(id => {
      if (!this.statement()[id]) {
        this.loadStatement(id);
      }
    });
  });
  loadStatement(id: number) {
    this.authService.getLevel(id).subscribe({
      next: (response) => {
        this.statement.update(current => ({
          ...current,
          [id]: response.level.category
        }));
      }
    });
  }
  colorEffect = effect(() => {
    const categories = Object.values(this.statement());

    const uniqueCategories = [...new Set(categories)];

    uniqueCategories.forEach(category => {
      if (!this.color()[category]) {
        this.loadColor(category);
      }
    });
  });
  loadColor(category: string) {
  this.authService.getExercisesByCategory(category).subscribe({
    next: (response) => {
      const total = response.listLevels.length;
      const completed = response.listLevels.filter(level => level.isPassed).length;
      const color = completed === total?'verde':completed>0?'amarillo':'gris';
      this.color.update(current => ({
        ...current,
        [category]: color
      }));
      this.loading.set(false);
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
        this.exercises.set(response);
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
