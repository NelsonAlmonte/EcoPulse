import { Component, inject, input } from '@angular/core';
import { User } from '@shared/models/user.model';
import {
  CircleUserIcon,
  FileSearchIcon,
  KeyRoundIcon,
  LogOutIcon,
  LucideAngularModule,
  StarIcon,
  UserCogIcon,
} from 'lucide-angular';
import { ProfileOptionsComponent } from '@features/profile/components/profile-options/profile-options.component';
import { ProfileCountersComponent } from '@features/profile/components/profile-counters/profile-counters.component';
import { ProfileDetailLoadingComponent } from '@shared/components/profile-detail-loading/profile-detail-loading.component';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css'],
  imports: [
    LucideAngularModule,
    ProfileOptionsComponent,
    ProfileCountersComponent,
    ProfileDetailLoadingComponent,
  ],
})
export class ProfileDetailComponent {
  user = input<User | null>();
  userService = inject(UserService);
  userIcon = CircleUserIcon;
  editProfileIcon = UserCogIcon;
  issuesIcon = FileSearchIcon;
  highlightedIcon = StarIcon;
  changePasswordIcon = KeyRoundIcon;
  logoutIcon = LogOutIcon;
}
