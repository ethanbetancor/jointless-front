import { ChangeDetectionStrategy, inject, Component, OnInit } from '@angular/core';
import { Title , Meta} from '@angular/platform-browser';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgClass } from "@angular/common";

@Component({
  selector: 'login',
  imports: [RouterLink, RouterLinkActive, NgClass],
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

  private title=inject(Title);
  private meta=inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Login');
    this.meta.updateTag({name:'description',content:'Este es mi Login'});
    this.meta.updateTag({name:'og:title',content:'Login'});
    this.meta.updateTag({name:'keywords',content:'Jointless,Proyecto,Metrica,Login'});
  }
}
