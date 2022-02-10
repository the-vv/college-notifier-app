import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  public enableMenu = false;
  private subs: Subscription = new Subscription();

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.subs.add(
      this.authService.user$.subscribe(user => {
        this.enableMenu = user !== null;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
