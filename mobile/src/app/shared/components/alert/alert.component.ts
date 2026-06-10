import { Component, input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  imports: [LucideAngularModule],
})
export class AlertComponent {
  icon = input<LucideIconData>();
  title = input<string>();
  content = input<string>();
}
