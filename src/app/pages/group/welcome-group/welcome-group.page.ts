import { Component, OnInit } from '@angular/core';
import { LogInService } from '../../entry/services/log-in.service';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-welcome-group',
  templateUrl: './welcome-group.page.html',
  styleUrls: ['./welcome-group.page.scss'],
})
export class WelcomeGroupPage implements OnInit {

  /* Variable que almacena el grupo actual */
  actualGroup: any;

  /* Variable que almacena la actividad privada actual */
  actualPrivateActivity: any;

  constructor(
    private groupService: GroupService,
    private login:LogInService
  ) { }

  ngOnInit() {
    this.login.isUserInSession();
    this.getActiveGroup();
  }

  /* Método que obtiene el grupo actual */
  getActiveGroup() {
    this.login.isUserInSession();
    this.groupService.getActiveGroup().subscribe(res => {
      this.actualGroup = res.actualGroup;
      this.actualPrivateActivity = res.actualPrivateActivity;
    });
  }

}
