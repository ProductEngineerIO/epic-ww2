// src/app/shared/components/coming-soon/coming-soon.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss',
})
export class ComingSoonComponent {
  @Input() heading!: string;
  @Input() body!: string;
}
