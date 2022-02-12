import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Observable, Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {

  @Input() public previewImage: string;
  @Output() public imageUploaded = new EventEmitter<string>();

  public loading = false;
  private uploaded = true;
  private uploader: Subscription;

  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() { }

  public promptImageUpload() {
    this.uploaded = false;
    Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Base64
    }).then(image => {
      this.previewImage = `data:image/${image.format};base64,${image.base64String}`;
      const imageBlob = this.dataUriToBlob(this.previewImage);
      const form: FormData = new FormData();
      form.append('image', imageBlob, `picture.${image.format}`);
      this.loading = true;
      this.uploader = this.commonService.uploadFiles(form).subscribe((res: any) => {
        this.loading = false;
        this.uploaded = true;
        if(res.length) {
          this.imageUploaded.emit(res[0].url);
          this.previewImage = res[0].url;
        }
      }, (err: any) => {
        this.loading = false;
      });
    }).catch(e => { /* nothing */ });
  }

  public removeImage(event: any) {
    this.previewImage = null;
    event.stopPropagation();
    this.imageUploaded.emit(null);
    if(!this.uploaded) {
      this.uploader.unsubscribe();
      this.uploaded = false;
    } else {
      this.uploaded = false;
      this.commonService.deleteFiles([this.previewImage]).subscribe(() => {
        this.uploaded = false;
      });
    }
  }

  private dataUriToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

}
