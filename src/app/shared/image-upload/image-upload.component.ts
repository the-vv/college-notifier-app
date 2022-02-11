import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';


@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {

  @Input() public previewImage: string;
  @Output() public imageUploaded = new EventEmitter<string>();

  public loading = true;

  constructor() { }

  ngOnInit() { }

  public promptImageUpload() {
    Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Base64
    }).then(image => {
      this.previewImage = `data:image/${image.format};base64,${image.base64String}`;
    }).catch(e => { /* nothing */ });
  }

  public removeImage(event: any) {
    this.previewImage = null;
    event.stopPropagation();
  }

}
