import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {EmployeeService} from '../../../shared-components/providers/employee.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  avatar: string;

  constructor(private empserve: EmployeeService, private router: Router) { }

  ngOnInit() {
  }

  avatarOrPic() {
    if (localStorage.getItem('EmpAvatarImg').length > 0) {
      this.avatar = localStorage.getItem('EmpAvatarImg');
      return true;
    }
  }
  logout() {
    this.empserve.logoutApp().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['sign-in']);
    });
  }
}
