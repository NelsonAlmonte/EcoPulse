import { Component, inject } from '@angular/core';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-profile-counters',
  templateUrl: './profile-counters.component.html',
  styleUrls: ['./profile-counters.component.css'],
})
export class ProfileCountersComponent {
  userService = inject(UserService);
}
