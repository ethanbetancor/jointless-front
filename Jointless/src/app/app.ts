import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Header } from "./shared/header/header";
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Jointless');
  constructor(private router: Router){}
  showHeaderAndFooter():boolean{
    const routes = ['/login', '/register'];
    return !routes.includes(this.router.url);
  }
}
