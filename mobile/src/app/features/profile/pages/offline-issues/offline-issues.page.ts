import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonRippleEffect,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { OfflineService } from '@core/services/offline.service';
import { OfflineIssueDetailComponent } from '@features/report/components/offline-issue-detail/offline-issue-detail.component';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { ArrowLeft, FolderOpenIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-offline-issues',
  templateUrl: './offline-issues.page.html',
  styleUrls: ['./offline-issues.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonRippleEffect,
    OfflineIssueDetailComponent,
    AlertComponent,
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule,
  ],
})
export class OfflineIssuesPage {
  offlineService = inject(OfflineService);
  backIcon = ArrowLeft;
  emptyIcon = FolderOpenIcon;
}
