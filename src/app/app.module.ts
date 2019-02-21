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
  MatSnackBarModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule,
  MatBadgeModule,
} from '@angular/material';

// Google Login Imports
import {HttpModule} from '@angular/http';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider
} from 'angular-6-social-login';
import {EmployeeService} from './shared-components/providers/employee.service';
import {RequestsService} from './shared-components/providers/requests.service';
import {PersonelRequestService} from './shared-components/providers/personel-request.service';
import {AuthGuardService as AuthGuard} from './shared-components/providers/auth-guard.service';
import {EmpAuthGuardService as EmpAuthGuard} from './shared-components/providers/emp-auth-guard.service';
import {HrAuthGuardService as HrAuthGuard} from './shared-components/providers/hr-auth-guard.service';

// Components
import {AvatarModule} from 'ngx-avatar';
import {MultiPurposePipe} from './shared-components/pipes/multi-purpose.pipe';
import {FilterSearchPipe} from './shared-components/pipes/filter-search.pipe';
import { AppComponent } from './app.component';
import { SignInComponent } from './shared-components/components/sign-in/sign-in.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SideMenuComponent } from './main-page/side-menu/side-menu.component';
import { EmployeePanelComponent } from './main-page/body-container/employees/employee-panel/employee-panel.component';
import {
  EmployeeRegistrationComponent
} from './main-page/body-container/employees/insert-or-update-employee/employee-registration.component';
import { RequestsContainerComponent } from './main-page/body-container/request/requests-container.component';
import {
  ExtraHoursRequestComponent
} from './shared-components/components/new-requests/extra-hours-request/extra-hours-request.component';
import {
  HolidaysNPermissionRequestComponent
} from './shared-components/components/new-requests/holidays-n-permission-request/holidays-n-permission-request.component';
import { BadgeFailRequestComponent } from './shared-components/components/new-requests/badge-fail-request/badge-fail-request.component';
import { MissionRequestComponent } from './shared-components/components/new-requests/mission-request/mission-request.component';
import {
  SubstitutedHolidaysRequestComponent
} from './shared-components/components/new-requests/substituted-holidays-request/substituted-holidays-request.component';
import { PersonelRequestsComponent } from './main-page/body-container/personel-requests/personel-requests.component';
import { ConfirmDialogComponent } from './shared-components/components/confirm-dialog/confirm-dialog.component';

// Other Imports
import {HrPermission} from './shared-components/permissions/hr-permission';
import {LayoutModule} from '@angular/cdk/layout';

// Translate Imports
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HrAuthGuardService} from './shared-components/providers/hr-auth-guard.service';


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
        path: ':empId/requests',
        component: RequestsContainerComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'extra-hours/:reqId',
            component: ExtraHoursRequestComponent
          },
          {
            path: 'extra-hours/new',
            component: ExtraHoursRequestComponent
          },
          {
            path: 'holiday-and-permission/:reqId',
            component: HolidaysNPermissionRequestComponent
          },
          {
            path: 'holiday-and-permission/new',
            component: HolidaysNPermissionRequestComponent
          },
          {
            path: 'mission/:reqId',
            component: MissionRequestComponent
          },
          {
            path: 'mission/new',
            component: MissionRequestComponent
          },
          {
            path: 'badge-fail/:reqId',
            component: BadgeFailRequestComponent
          },
          {
            path: 'badge-fail/new',
            component: BadgeFailRequestComponent
          },
          {
            path: 'substituted-holidays/:reqId',
            component: SubstitutedHolidaysRequestComponent
          },
          {
            path: 'substituted-holidays/new',
            component: SubstitutedHolidaysRequestComponent
          }
        ]
      },
      {
        path: 'employees',
        component: EmployeePanelComponent,
        canActivate: [EmpAuthGuard],
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
      },
      {
        path: 'request-management',
        component: PersonelRequestsComponent,
        canActivate: [HrAuthGuard],
        children: [
          {
            path: 'extra-hours/:reqId',
            component: ExtraHoursRequestComponent
          },
          {
            path: 'holiday-and-permission/:reqId',
            component: HolidaysNPermissionRequestComponent
          },
          {
            path: 'mission/:reqId',
            component: MissionRequestComponent
          },
          {
            path: 'badge-fail/:reqId',
            component: BadgeFailRequestComponent
          },
          {
            path: 'substituted-holidays/:reqId',
            component: SubstitutedHolidaysRequestComponent
          },
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/hr',
    pathMatch: 'full'
  }
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

// Translate Service
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    RequestsContainerComponent,
    SideMenuComponent,
    EmployeePanelComponent,
    EmployeeRegistrationComponent,
    MainPageComponent,
    MultiPurposePipe,
    FilterSearchPipe,
    SignInComponent,
    ConfirmDialogComponent,
    ExtraHoursRequestComponent,
    HolidaysNPermissionRequestComponent,
    BadgeFailRequestComponent,
    MissionRequestComponent,
    SubstitutedHolidaysRequestComponent,
    PersonelRequestsComponent
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
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatBadgeModule,
    LayoutModule,
    RouterModule.forRoot(EmployeeRoutes),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],

  providers: [
    EmployeeService,
    RequestsService,
    PersonelRequestService,
    AuthGuard,
    EmpAuthGuard,
    HrAuthGuard,
    HrPermission,
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
