import { Component, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;
  @ViewChild(PlaceholderDirective) alertHost!: PlaceholderDirective;

  private closeSub!: Subscription;

  constructor(private authService: AuthService, 
              private router: Router,
              private viewContainerRef: ViewContainerRef) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;

    let authObs: Observable<AuthResponseData>;

    if(this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe({
      next: resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (errorMessage: string) => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
        this.showErrorAlert(errorMessage);
      }
    })

    form.reset();
  }

  onCloseAlert() {
    this.error = null;
  }

  private showErrorAlert(message: string) {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(AlertComponent);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }
}
