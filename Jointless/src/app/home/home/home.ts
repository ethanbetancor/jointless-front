import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'home',
  imports: [Header],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
