import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'control',
  template: ''
})
export class Control implements OnInit{
  private router = inject(Router);
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/login');
    }
    else{
      this.router.navigateByUrl('/home');
    }
  }

}
