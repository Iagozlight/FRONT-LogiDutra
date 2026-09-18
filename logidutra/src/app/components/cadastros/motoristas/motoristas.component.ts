import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-motoristas',
  imports: [],
  templateUrl: './motoristas.component.html',
  styleUrl: './motoristas.component.scss'
})
export class MotoristasComponent {
  router = inject(Router);
}
