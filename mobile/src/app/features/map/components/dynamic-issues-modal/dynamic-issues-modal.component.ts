import { Component, inject } from '@angular/core';
import { IssueService } from '@core/services/issue.service';
import { IssueListComponent } from '@features/report/components/issue-list/issue-list.component';
import { IonContent, ModalController } from '@ionic/angular/standalone';
import { LucideAngularModule, MapIcon, XIcon } from 'lucide-angular';

@Component({
  selector: 'app-dynamic-issues-modal',
  templateUrl: './dynamic-issues-modal.component.html',
  styleUrls: ['./dynamic-issues-modal.component.css'],
  imports: [IonContent, IssueListComponent, LucideAngularModule],
})
export class DynamicIssuesModalComponent {
  issueService = inject(IssueService);
  modalController = inject(ModalController);
  mapIcon = MapIcon;
  xIcon = XIcon;

  async close() {
    const modal = await this.modalController.getTop();
    modal?.dismiss();
  }

  async setBreakpoint(breakpoint: number) {
    const modal = await this.modalController.getTop();
    modal?.setCurrentBreakpoint(breakpoint);
  }
}
