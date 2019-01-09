import {Component, OnInit} from '@angular/core';
import {Response} from '@angular/http';
import {EmployeeService} from './shared-components/providers/employee.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private getStatus: EmployeeService, private router: Router) {}

  ngOnInit() {
    // this.getStatuss();
  }

  // getStatuss() {
  //   this.getStatus.getAppStatus().subscribe((type: Response) => {
  //     if (type.statusText === 'Unauthorized') {
  //       console.log('localStorage clear');
  //       localStorage.clear();
  //       console.log('redirected to sign-in');
  //       this.router.navigate(['sign-in']);
  //     } else {
  //       console.log('redirected to sign-in');
  //       this.router.navigate(['hr']);
  //     }
  //   });
  // }
}
