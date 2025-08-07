import { Component, inject, input } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { LucideAngularModule, XIcon } from 'lucide-angular';

@Component({
  selector: 'app-issue-photo',
  templateUrl: './issue-photo.component.html',
  styleUrls: ['./issue-photo.component.css'],
  imports: [LucideAngularModule],
})
export class IssuePhotoComponent {
  photo = input.required<string>();
  modalController = inject(ModalController);
  closeIcon = XIcon;

  close(): Promise<boolean> {
    return this.modalController.dismiss();
  }
}
