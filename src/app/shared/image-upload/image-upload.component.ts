import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Subscription } from 'rxjs';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ImageUploadComponent
    }
  ]
})
export class ImageUploadComponent implements OnInit, ControlValueAccessor {

  @Input() public previewImage: string;

  public loading = false;
  touched = false;
  disabled = false;
  uploaded = true;
  uploader: Subscription;
  private toUpload: FormData;
  private toDelete: string;

  constructor(
    private commonService: CommonService
  ) { }

  onChange = (val: any) => { };
  onTouched = () => { };

  ngOnInit() { }

  public promptImageUpload() {
    if (this.disabled) {
      return;
    }
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
      this.toUpload = form;
    }).catch(e => { /* nothing */ });
  }

  public removeImage(event: any) {
    if (this.disabled) {
      return;
    }
    event.stopPropagation();
    this.onChange(null);
    if (!this.uploaded) {
      this.uploader.unsubscribe();
      this.uploaded = false;
    } else if (this.previewImage) {
      this.uploaded = false;
    }
    if (!this.previewImage.startsWith('data:')) {
      this.toDelete = this.previewImage;
    }
    this.previewImage = null;
    this.toUpload = null;
  }

  writeValue(url: string) {
    this.previewImage = url;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  public uploadImage() {
    return new Promise<void>((resolve, reject) => {
      if (this.toUpload) {
        this.loading = true;
        this.uploader = this.commonService.uploadFiles(this.toUpload).subscribe((res: any) => {
          this.loading = false;
          this.uploaded = true;
          if (res.length) {
            this.onChange(`${res[0].url}?fid=${res[0].fileId}`);
            this.previewImage = `${res[0].url}?fid=${res[0].fileId}`;
            resolve();
          }
        }, (err: any) => {
          reject(err);
          this.commonService.showToast(`${EStrings.error}: ${err.error.message}`);
          this.loading = false;
        });
      } else {
        resolve();
      }
      if (this.toDelete) {
        this.commonService.deleteFiles([this.toDelete]).subscribe(_ => undefined, _ => undefined);
      }
    });
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
