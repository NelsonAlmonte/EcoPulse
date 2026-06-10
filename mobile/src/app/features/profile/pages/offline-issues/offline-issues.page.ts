import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonActionSheet,
  IonButtons,
  IonContent,
  IonHeader,
  IonRippleEffect,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ArrowLeft, LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { OfflineService } from '@core/services/offline.service';
import { OfflineIssueDetailComponent } from '@features/report/components/offline-issue-detail/offline-issue-detail.component';

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
    IonActionSheet,
    OfflineIssueDetailComponent,
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule,
  ],
})
export class OfflineIssuesPage implements OnInit {
  offlineService = inject(OfflineService);
  backIcon = ArrowLeft;

  ngOnInit() {}
}
