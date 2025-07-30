import { Component, input, OnInit } from '@angular/core';
import { ApiResult } from '@core/interfaces/api.interface';
import { User } from '@shared/models/user.model';
import { CircleUserIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css'],
  imports: [LucideAngularModule],
})
export class ProfileDetailComponent implements OnInit {
  user = input.required<ApiResult<User>>();
  userIcon = CircleUserIcon;

  ngOnInit(): void {}

  get userData() {
    return this.user().data!;
  }
}
