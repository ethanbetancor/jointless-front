import { Component, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export  class Header implements OnInit{
  userName = signal('');

  ngOnInit(): void {
    const localStorageUsername = localStorage.getItem('username');
    this.userName.set(localStorageUsername ||'Invitado');
  }
}
