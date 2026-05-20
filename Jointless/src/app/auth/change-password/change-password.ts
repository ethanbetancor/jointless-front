import { ChangeDetectionStrategy, inject, Component, OnInit } from '@angular/core';
import { Title , Meta} from '@angular/platform-browser';

@Component({
  selector: 'change-password',
  imports: [],
  templateUrl: './change-password.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePassword implements OnInit{

  private title=inject(Title);
  private meta=inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('ChangePassword');
    this.meta.updateTag({name:'description',content:'Este es mi ChangePassword'});
    this.meta.updateTag({name:'og:title',content:'ChangePassword'});
    this.meta.updateTag({name:'keywords',content:'Jointless,Proyecto,Metrica,ChangePassword'});
  }
}
