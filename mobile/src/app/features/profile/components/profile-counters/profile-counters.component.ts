import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-profile-counters',
  templateUrl: './profile-counters.component.html',
  styleUrls: ['./profile-counters.component.css'],
})
export class ProfileCountersComponent implements OnInit {
  userService = inject(UserService);
  authService = inject(AuthService);

  ngOnInit() {
    this.userService.countUserIssues(this.authService.loggedUserData()!.id);
    this.userService.counthighlightsGiven(
      this.authService.loggedUserData()!.id
    );
    this.userService.counthighlightsReceived(
      this.authService.loggedUserData()!.id
    );
  }
}
