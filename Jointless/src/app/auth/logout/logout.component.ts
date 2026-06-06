import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, inject, OnInit } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
interface ResponseLogout{
  message: string
}
@Component({
  selector: 'logout',
  template: ''
})
export class LogoutComponent implements OnInit {

  private router = inject(Router);
  private http = inject(HttpClient);

  private title=inject(Title);
  private meta=inject(Meta);
  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) this.router.navigateByUrl('/login');
    const headers = new HttpHeaders({
      authorization: `Bearer ${token}`
    });
    this.http.post<ResponseLogout>('http://jointless-back-production.up.railway.app/api/v1/users/logout',{},{headers}).subscribe({
      next: (response) => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        alert(response.message);
        this.router.navigateByUrl('/login');
      },
      error: () => {
        console.log('Error del servidor');
      }
    });
    this.title.setTitle('Logout');
    this.meta.updateTag({name:'description',content:'Este es mi Logout'});
    this.meta.updateTag({name:'og:title',content:'Logout'});
    this.meta.updateTag({name:'keywords',content:'Jointless,Proyecto,Metrica,Logout'});
  }
}