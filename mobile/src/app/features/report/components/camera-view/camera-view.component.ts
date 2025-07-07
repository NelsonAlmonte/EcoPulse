import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-camera-view',
  templateUrl: './camera-view.component.html',
  styleUrls: ['./camera-view.component.scss'],
  imports: [IonButton],
})
export class CameraViewComponent implements OnInit {
  @ViewChild('picture') picture!: ElementRef<HTMLImageElement>;

  constructor() {}

  ngOnInit() {}

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });

    this.picture.nativeElement.src = image.webPath!;
  }
}
