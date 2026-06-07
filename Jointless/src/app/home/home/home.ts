import { ChangeDetectionStrategy, inject, Component, OnInit, computed, signal } from '@angular/core';
import { Title , Meta} from '@angular/platform-browser';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from '../../auth/auth.service';
import { IdLevel } from '../../service/id_lvl.service';

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



interface CategoryButton{
  name: string;
  colorClass: 'verde' | 'amarillo' | 'gris';
  infoHover: LvlResponse | null;
  exercisesNumber: number;
  percentageCompleted: number;
}

@Component({
  selector: 'home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit{
  private router = inject(Router); 
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private serviceId = inject(IdLevel);
  private url = 'http://localhost:8080';
  exercises = signal<LvlAllResponse>({
    listLevels: []
  });

  categorysButtons = computed<CategoryButton[]>(()=>{
    const list = this.exercises();
    if (list.listLevels.length===0)return [];
    const groups: { [key:string]:LvlResponse[]}={};
    list.listLevels.forEach(item=>{
      if (!groups[item.level.category])groups[item.level.category]=[];
      groups[item.level.category].push(item);
    });
    return Object.keys(groups).map(categoryName=>{
      const elements = groups[categoryName];
      const totalTrue = elements.filter(exercise=>exercise.isPassed).length;
      const totalTFalse = elements.filter(exercise=>!exercise.isPassed).length;
      let colorClass: 'verde' | 'gris' | 'amarillo';
      if (totalTrue===elements.length)colorClass='verde';
      else if (totalTFalse===elements.length)colorClass='gris';
      else colorClass='amarillo';
      const infoHover=elements.find(exercise=>!exercise.isPassed)||null;
      return {
        name: categoryName.replaceAll('_',' '),
        colorClass,
        infoHover,
        exercisesNumber:elements.length,
        percentageCompleted: (totalTrue/elements.length)*100
      };
    });
  });
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

  borderGradient(buttons:CategoryButton){
    const completed=buttons.percentageCompleted;
    let backgroundStyle ='';
    if (buttons.colorClass=='amarillo'){
      backgroundStyle= 'linear-gradient(to bottom right, #facc15, #eab308)';
    }else if (buttons.colorClass=='verde'){
      backgroundStyle= 'linear-gradient(to bottom right, #22c55e, #16a34a)';
    }else{
      backgroundStyle= 'linear-gradient(to bottom right, #d1d5db, #4b5563)';
    }
    const borderStyle= `conic-gradient(#22c55e ${completed}%,#d1d5db ${completed}% 100%)`;
    return `${backgroundStyle} padding-box, ${borderStyle} border-box`;
  }

  private title=inject(Title);
  private meta=inject(Meta);
  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigateByUrl('/login');
    }
    const headers = new HttpHeaders({
      authorization: `Bearer ${token}`
    });
    this.http.post<LvlAllResponse>(`${this.url}/api/v1/lvl/get/all`,{},{headers}).subscribe({
      next: (response: LvlAllResponse)=>{
        this.exercises.set(response);   
      }, error: (error)=>{
        if (error.status === 404)console.log('Ejercicio no accesible');
        console.log('Error del servidor');
      }
    })
    this.title.setTitle('Home');
    this.meta.updateTag({name:'description',content:'Este es mi Home'});
    this.meta.updateTag({name:'og:title',content:'Home'});
    this.meta.updateTag({name:'keywords',content:'Jointless,Proyecto,Metrica,Home'});
  }
}
