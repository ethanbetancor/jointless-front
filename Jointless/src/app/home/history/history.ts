import { ChangeDetectionStrategy, inject, Component, OnInit, effect, signal } from '@angular/core';
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
  exercises = signal<ListSolutions>({ listSolutions: [] });
  titles = signal<Record<number, string>>({});
  statement = signal<Record<number, string>>({});
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
  private title=inject(Title);
  private meta=inject(Meta);
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token stored');
    const headers = new HttpHeaders({
      authorization: `Bearer ${token}`
    });
    this.http.post<ListSolutions>(
      `${this.url}/api/v1/solutions/user`,
      {},
      { headers }
    ).subscribe({
      next: (response) => {
        this.exercises.set(response);
      },
      error: () => {
        alert('Error del servidor');
      }
    });
    this.title.setTitle('Home');
    this.meta.updateTag({ name: 'description', content: 'Este es mi Home' });
    this.meta.updateTag({ name: 'og:title', content: 'Home' });
    this.meta.updateTag({ name: 'keywords', content: 'Jointless,Proyecto,Metrica,Home' });
  }
}
