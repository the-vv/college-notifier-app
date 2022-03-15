import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EStrings } from 'src/app/interfaces/strings.enum';
import { CommonService } from 'src/app/services/common.service';
import { FilePicker } from '@robingenz/capacitor-file-picker';




@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FileUploadComponent
    }
  ]
})
export class FileUploadComponent implements OnInit, ControlValueAccessor {

  @Input() public previewUrl: string;
  public fileData: any;

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

  public chooseFile() {
    if (this.disabled) {
      return;
    }
    FilePicker.pickFiles({
      types: ['*/*'],
      multiple: false,
      readData: true
    }).then(image => {
      if (!image.files.length) {
        return;
      }
      this.fileData = image.files[0];
      this.previewUrl = `data:${this.fileData.mimeType}/${this.fileData.name.split('.').slice(-1)};base64,${this.fileData.data}`;
      const fileBlob = this.dataUriToBlob(this.previewUrl);
      const form: FormData = new FormData();
      form.append('file', fileBlob, `picture.${this.fileData}`);
      this.toUpload = form;
    }).catch(e => { console.log(e); });
  }

  public removeImage(event: any) {
    if (this.disabled) {
      return;
    }
    event.stopPropagation();
    this.onChange(null);
    this.uploader?.unsubscribe();
    this.uploaded = false;
    if (!this.previewUrl.startsWith('data:')) {
      this.toDelete = this.previewUrl;
    }
    this.previewUrl = null;
  }

  writeValue(url: string) {
    this.previewUrl = url;
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
        this.commonService.deleteFiles([this.toDelete]).subscribe(() => { }, err => { });
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
