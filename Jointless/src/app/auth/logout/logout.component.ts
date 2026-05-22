import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  template: ''
})
export class LogoutComponent implements OnInit {

  private router = inject(Router);

  ngOnInit() {
    localStorage.removeItem('username');
    localStorage.removeItem('credentials');

    this.router.navigateByUrl('/login');
  }
}