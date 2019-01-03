import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Material Imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';

// Google Login Imports
import {SocialLoginModule, AuthServiceConfig, GoogleLoginProvider} from 'angular-6-social-login';

import { AppComponent } from './app.component';
import { AvatarModule } from 'ngx-avatar';
import {RouterModule, Routes} from '@angular/router';
import { ReuestsContainerComponent } from './body-container/reuests-container/reuests-container.component';
import { SideMenuComponent } from './body-container/side-menu/side-menu.component';
import { EmployeePanelComponent } from './body-container/employees/employee-panel/employee-panel.component';
import { EmployeeRegistrationComponent } from './body-container/employees/employee-registration/employee-registration.component';
import { SigninComponent } from './signin/signin.component';

const EmployeeRoutes: Routes = [
  {
    path: '',
    redirectTo: '/employee/1/requests',
    pathMatch: 'full'
  },
  {
    path: 'employee/1/requests',
    component: ReuestsContainerComponent
  },
  {
    path: 'employee/1/employees',
    component: EmployeePanelComponent
  },
  {
    path: '**',
    redirectTo: 'employee/1/requests',
    pathMatch: 'full'
  }
];

export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('Your-Google-Client-Id')
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
    SigninComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, NoopAnimationsModule,
    MatButtonModule, MatCheckboxModule, MatGridListModule,
    MatIconModule, MatSidenavModule, AvatarModule, MatToolbarModule,
    RouterModule.forRoot(EmployeeRoutes),
    SocialLoginModule
  ],
  providers: [{
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
