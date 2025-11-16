import { Component, inject, input } from '@angular/core';
import { IssueService } from '@core/services/issue.service';
import { ModalController } from '@ionic/angular/standalone';
import { RelativeTimePipe } from '@shared/pipes/relative-time.pipe';
import { DEFAULT_STATUS, iconMap } from '@shared/constants/system.constant';
import { Issue } from '@shared/models/issue.model';
import { HighlightButtonComponent } from '@features/report/components/highlight-button/highlight-button.component';
import { IssuePhotoComponent } from '@features/report/components/issue-photo/issue-photo.component';
import { IssueDetailLoadingComponent } from '@shared/components/issue-detail-loading/issue-detail-loading.component';
import {
  CheckCircleIcon,
  CircleUserIcon,
  ClockIcon,
  LucideAngularModule,
  LucideIconData,
  Maximize2Icon,
  TreePineIcon,
} from 'lucide-angular';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css'],
  imports: [
    LucideAngularModule,
    HighlightButtonComponent,
    IssueDetailLoadingComponent,
    RelativeTimePipe,
  ],
})
export class IssueDetailComponent {
  issueService = inject(IssueService);
  modalController = inject(ModalController);
  issue = input.required<Issue | null>();
  DEFAULT_STATUS = DEFAULT_STATUS;
  checkCircle = CheckCircleIcon;
  clockIcon = ClockIcon;
  userIcon = CircleUserIcon;
  viewPhotoIcon = Maximize2Icon;

  get issueData() {
    return this.issue()?.id ? this.issue() : this.issueService.issue();
  }

  showIcon(iconName: string): LucideIconData {
    return iconMap[iconName] || TreePineIcon;
  }

  async viewPhoto(issue: Issue): Promise<void> {
    const modal = await this.modalController.create({
      component: IssuePhotoComponent,
      cssClass: 'issue-photo-modal',
      componentProps: {
        photo: issue.photo,
      },
    });

    await modal.present();
  }
}
