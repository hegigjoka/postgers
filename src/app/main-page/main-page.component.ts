import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {EmployeeService} from '../shared-components/providers/employee.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HrPermission} from '../shared-components/permissions/hr-permission';
import {RequestsService} from '../shared-components/providers/requests.service';
import {AbstractModel} from '../shared-components/models/shared-models/abstract.model';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  @ViewChild('menu') menu: MatSidenav;
  sideNav = 'close';
  search: string;
  searchTypes = [];
  statusType: AbstractModel[];
  requestType: AbstractModel[];
  hrType = [];
  hrRequestType: AbstractModel[];
  hrProcessType: AbstractModel[];

  searchEN = ["Employees", "My requests", "Pending Actions", "HR Office"];
  searchIT = ["Dipendenti", "Le mie Richieste", "Azioni in Sospeso","Risorse Umane"];
  searchSQ = ["Punonjesit", "Kerkesat e mia", "Veprimet ne Pritje", "Burimet Njerezore"];

  avatar: string;

  constructor(
    private reqServe: RequestsService,
    public permissions: HrPermission,
    private status: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (localStorage.getItem('EmpLang') === 'en') {
      this.searchEN.forEach((value) => {this.searchTypes.push(value);});
    } else if (localStorage.getItem('EmpLang') === 'it') {
      this.searchIT.forEach((value) => {this.searchTypes.push(value);});
    } else {
      this.searchSQ.forEach((value) => {this.searchTypes.push(value);});
    }
    this.getStatus();
  }

  onKey(type: string) {
    type = type.toLowerCase();
    if (this.search.match(/:/)) {
      if (type.match(/employees/) || type.match(/dipendenti/) || type.match(/punonjesit/)) {
        this.router.navigate(['employees'], {relativeTo: this.route, queryParams: {search: this.search.split(':')[1]}});
      }
    }
  }
  onEnter(search: string) {
    search = search.toLowerCase();
    if (search !== '' && !search.match(/:/)) {
      this.search = this.search + ':';
      if (search.match(/requests/) || search.match(/richieste/) || search.match(/kerkesat/)) {
        setTimeout(() => {
          this.reqServe.getTableOptions().subscribe((response) => {
            this.statusType = response.json().body.data.fieldMap.status.fieldDataPool.list;
            this.statusType.forEach((value) => {
              value.someLabel = `${this.search}${value.someLabel}`;
            });
            this.router.navigate([this.permissions.employee.id, 'requests'], {relativeTo: this.route, queryParams: {type: 'me'}});
          });
        }, 600);
      } else if (search.match(/actions/) || search.match(/azioni/) || search.match(/veprimet/)) {
        setTimeout(() => {
          this.reqServe.getTableOptions().subscribe((response) => {
            this.requestType = response.json().body.data.fieldMap.requestTypeId.fieldDataPool.list;
            this.requestType.forEach((value) => {
              value.someLabel = `${this.search}${value.someLabel}`;
            });
            this.router.navigate([this.permissions.employee.id, 'requests'], {relativeTo: this.route, queryParams: {type: 'pendingMe'}});
          });
        }, 600);
      } else if (search.match(/hr/) || search.match(/Risorse/) || search.match(/Burimet/)) {
        let filters = [];
        if (localStorage.getItem('EmpLang') === 'en') {
          filters[0] = `${this.search}Request type:`;
          filters[1] = `${this.search}Process type:`;
        } else if (localStorage.getItem('EmpLang') === 'it') {
          filters[0] = `${this.search}Tipo di richiesta:`;
          filters[1] = `${this.search}Tipo di processo`;
        } else {
          filters[0] = `${this.search}Tipi i kerkeses:`;
          filters[1] = `${this.search}Tipi i procesimit:`;
        }
        this.router.navigate(['request-management'], {relativeTo: this.route});
        this.hrType[0] = filters[0];
        this.hrType[1] = filters[1];
        setTimeout(() => {
          this.reqServe.getTableOptions().subscribe((response) => {
            this.hrRequestType = response.json().body.data.fieldMap.requestTypeId.fieldDataPool.list;
            this.hrRequestType.forEach((value) => {
              value.someLabel = `${filters[0]}${value.someLabel}`;
            });
            this.hrProcessType = response.json().body.data.fieldMap.processedId.fieldDataPool.list;
            this.hrProcessType.forEach((value) => {
              value.someLabel = `${filters[1]}${value.someLabel}`;
            });
          });
        }, 600);
      }
    } else {
      if (search.match(/requests/) || search.match(/richieste/) || search.match(/kerkesat/)) {
        this.statusType.forEach((value) => {
          if (value.someLabel.toLowerCase().match(search.toLowerCase().split(':')[1])) {
            this.router.navigate([this.permissions.employee.id, 'requests'], {relativeTo: this.route, queryParams: {type: 'me', search: value.id}});
          }
        });
      } else if (search.match(/actions/) || search.match(/azioni/) || search.match(/veprimet/)) {
        this.requestType.forEach((value) => {
          if (value.someLabel.toLowerCase().match(search.toLowerCase().split(':')[1])) {
            this.router.navigate([this.permissions.employee.id, 'requests'], {relativeTo: this.route, queryParams: {type: 'pendingMe', search: value.id}});
          }
        });
      } else if (search.toLowerCase().match(/process/) || search.toLowerCase().match(/processo/) || search.toLowerCase().match(/procesimit/)) {
        this.hrProcessType.forEach((value) => {
          if (value.someLabel.toLowerCase().match(search.toLowerCase().split(':')[2]) && search.toLowerCase().split(':')[2].match(/[a-z]+/)) {
            this.router.navigate(['request-management'], {relativeTo: this.route, queryParams: {search: value.id}});
          }
        });
      } else if (search.toLowerCase().match(/:request type/) || search.toLowerCase().match(/:tipo di richiesta/) || search.toLowerCase().match(/:tipi i procesimit/)) {
        this.hrRequestType.forEach((value) => {
          if (value.someLabel.toLowerCase().split(':')[2] === search.toLowerCase().split(':')[2] && search.toLowerCase().split(':')[2].match(/[a-z]+/)) {
            this.router.navigate(['request-management'], {relativeTo: this.route, queryParams: {search: value.id}});
          }
        });
      }
    }
  }

  getStatus() {
    this.status.getAppStatus(localStorage.getItem('EmpAuthToken')).subscribe(
      (response) => {
        if (response.json().status.code === 'STATUS_OK') {
          this.permissions.hrAllRequest = response.json().body.data.appPermissions['hr/allRequests'];
          this.permissions.hrEmployee = response.json().body.data.appPermissions['hr/employee'];
          this.permissions.hrRequests = response.json().body.data.appPermissions['hr/employee/:empId/requests'];
          this.permissions.hrRequestsType = response.json().body.data.appPermissions['hr/employee/:empId/requests/type/:type'];
          this.permissions.employee.id = response.json().body.data.userAttributes.HR_MODULES__APP.attributeValue;
          this.permissions.employee.fullName = response.json().body.data.fullName;
          this.permissions.employee.img = response.json().body.data.pictureSrc;
        } else {
          localStorage.removeItem('EmpAuthToken');
          this.router.navigate(['sign-in']);
        }
      },
      (error) => {
        localStorage.removeItem('EmpAuthToken');
        this.router.navigate(['sign-in']);
      }
    );
  }

  iconToggle() {
    this.sideNav = 'open';
    this.menu.toggle();
  }
  backing(firedEvent?: boolean) {
    if (this.sideNav === 'open' || firedEvent === true) {
      this.sideNav = 'close';
      this.menu.toggle();
    }
  }

  setCreds(type: string) {
    if (type === 'office') {
      return 'CED';
    } else {
      return this.permissions.employee.fullName;
    }
  }

  avatarOrPic() {
    if (this.permissions.employee.img !== '') {
      if (this.permissions.employee.img.length > 0) {
        this.avatar = this.permissions.employee.img;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
