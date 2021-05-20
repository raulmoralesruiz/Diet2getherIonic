import { Component, OnInit } from '@angular/core';
import { LogInService } from '../../entry/services/log-in.service';
import { DayRegimeInterface } from '../../regime/models/dayRegime.interface';
import { RegimeService } from '../../regime/services/regime.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  dishNullFlag: boolean = true;
  actualUser: string;
  dateNow: number;
  dayRegime: DayRegimeInterface = { id: null, day: 'Holi', meals: [] };

  constructor(
    private login: LogInService,
    private regimeService: RegimeService
  ) {}

  ngOnInit() {
    this.login.isUserInSession();
    this.getActualUser();
    this.getDateNow();
    this.getRegimeDayOfWeek();
  }

  getActualUser() {
    this.actualUser = localStorage.getItem('dietUsernameSession');
  }

  getDateNow() {
    this.dateNow = Date.now();
  }

  getRegimeDayOfWeek() {
    this.regimeService.getDayOfWeekRegime().subscribe((response) => {
      this.dayRegime = response;

      if (this.dayRegime.meals != null) {
        let cont = 0;

        for (let meal of this.dayRegime.meals) {
          if (meal.dish == null) {
            cont++;
          }

          if (cont == this.dayRegime.meals.length) {
            this.dishNullFlag = false;
          } else {
            this.dishNullFlag = true;
          }
        }
      }
    });
  }
}
