// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

// Material Imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatSidenavModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatDialogModule,
  MatSnackBarModule
} from '@angular/material';

// Google Login Imports
import {HttpModule} from '@angular/http';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider
} from 'angular-6-social-login';
import {EmployeeService} from './shared-components/providers/employee.service';
import {AuthGuardService as AuthGuard} from './shared-components/providers/auth-guard.service';

// Components
import { AppComponent } from './app.component';
import { AvatarModule } from 'ngx-avatar';
import {MultiPurposePipe} from './shared-components/pipes/multi-purpose.pipe';
import { ReuestsContainerComponent } from './main-page/body-container/reuests-container/reuests-container.component';
import { SideMenuComponent } from './main-page/body-container/side-menu/side-menu.component';
import { EmployeePanelComponent } from './main-page/body-container/employees/employee-panel/employee-panel.component';
import { EmployeeRegistrationComponent } from './main-page/body-container/employees/employee-registration/employee-registration.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ConfirmDialogComponent } from './shared-components/components/confirm-dialog/confirm-dialog.component';

// App Routers
const EmployeeRoutes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'hr',
    component: MainPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'requests',
        component: ReuestsContainerComponent
      },
      {
        path: 'employees',
        component: EmployeePanelComponent,
        children: [
          {
            path: ':emp',
            component: EmployeeRegistrationComponent
          },
          {
            path: 'new-employee',
            component: EmployeeRegistrationComponent
          }
        ]
      }
    ]
  }
  // {
  //   path: '**',
  //   redirectTo: '/sign-in',
  //   pathMatch: 'full'
  // }
];

// Google Authentication Service
export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('520043598807-u86mp25v1h525oh2763e7duu9l1lklkd.apps.googleusercontent.com')
      }
    ]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    ReuestsContainerComponent,
    SideMenuComponent,
    EmployeePanelComponent,
    EmployeeRegistrationComponent,
    MainPageComponent,
    MultiPurposePipe,
    SignInComponent,
    ConfirmDialogComponent
  ],

  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSidenavModule,
    AvatarModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    FormsModule,
    SocialLoginModule,
    MatRippleModule,
    MatDialogModule,
    MatSnackBarModule,
    RouterModule.forRoot(EmployeeRoutes)
  ],

  providers: [
    EmployeeService,
    AuthGuard,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],

  entryComponents: [
    EmployeePanelComponent,
    EmployeeRegistrationComponent,
    ConfirmDialogComponent
  ],

  bootstrap: [AppComponent]
})
export class AppModule {}
