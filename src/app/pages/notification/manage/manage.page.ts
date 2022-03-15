import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class NotificationManagePage implements OnInit {

  public quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['link']
    ]
  };
  public loading = false;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    console.log('Submitted');
  }

}
