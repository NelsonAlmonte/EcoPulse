import { Component } from '@angular/core';
import { LucideAngularModule, User } from 'lucide-angular';

@Component({
  selector: 'app-profile-detail-loading',
  templateUrl: './profile-detail-loading.component.html',
  styleUrls: ['./profile-detail-loading.component.css'],
  standalone: true,
  imports: [LucideAngularModule],
})
export class ProfileDetailLoadingComponent {
  userIcon = User;
}
