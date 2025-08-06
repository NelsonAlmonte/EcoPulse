import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { LogInIcon, LucideAngularModule, UserPenIcon } from 'lucide-angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.css'],
  standalone: true,
  imports: [IonContent, RouterModule, LucideAngularModule],
})
export class WelcomePage {
  loginIcon = LogInIcon;
  signupIcon = UserPenIcon;
}
