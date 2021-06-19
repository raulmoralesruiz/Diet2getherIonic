import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonInfiniteScroll, IonSegment, IonSlides, LoadingController } from '@ionic/angular';
import { LogInService } from '../../entry/services/log-in.service';
import { AthleteRankingInterface } from '../models/athlete-ranking.interface';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.page.html',
  styleUrls: ['./group-view.page.scss'],
})
export class GroupViewPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(IonSegment) segment: IonSegment;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll; 
  
  /* Variable que almacena la pestaña activa */
  activeMenuTab: string;

  /* Variable que almacena la barra de progreso */
  progressBar: any = '';

  actualSlide: number = 0;

  actualGroup: any;
  athletes: any = [];
  actualPage: number = 1;
  nextRegisterDate: any;
  isRegisterActive: boolean = true;
  registers: any;
  weightDifference: number;
  registersToVerify: any = [];
  userIsGroupAdmin: boolean;
  isBoostAthlete:string = "false";
  actualUserSession = "Holis"

  showActive: boolean;

  /** Grafica para registros totales */
  chartData : any[];
  labelX = "Fechas";
  labelY = "Pesos";

  /** Grafica para puntos del grupo */
  chartPointData : any[];

  loading: HTMLIonLoadingElement;

  constructor(
    private groupService: GroupService,
    private router: Router,
    private login: LogInService,
    private alertController: AlertController,
    public loadingController: LoadingController
  ) {
    this.actualGroup = 'hola';
    this.registers = 'holi';
    this.progressBar = 'buenas';
  }

  ngOnInit() {
    this.login.isUserInSession();
    this.showActive = true;
    this.getActualGroup();
    this.getRegisters();
    this.getProgressBar();
    this.getChartTotalRegisters();
    this.getChartPoints();
  }

  changeMenuTab(toChange: string) {
    this.activeMenuTab = toChange;

    if (toChange == 'ranking') {
      this.slides.slideTo(0);
    }
    
    if (toChange == 'registros') {
      this.slides.slideTo(1);
    }
    
    if (toChange == 'estadisticas') {
      this.slides.slideTo(2);
    }
  }

  segmentChanged() {
    let toChange = this.segment.value;

    if (toChange == 'ranking') this.slides.slideTo(0);
    if (toChange == 'registros') this.slides.slideTo(1);
    if (toChange == 'estadisticas') this.slides.slideTo(2);
  }

  changeSlide() {
    this.slides.getActiveIndex().then(index => {
      this.actualSlide = index;

      if (index == 0) {
        this.changeMenuTab('ranking');
        this.segment.value = 'ranking'
      }

      if (index == 1) {
        this.changeMenuTab('registros');
        this.segment.value = 'registros'
      }

      if (index == 2) {
        this.changeMenuTab('estadisticas');
        this.segment.value = 'estadisticas'
      }
    });
  }

  doRefresh(event) {
    this.getActualGroup();
    this.getRegisters();
    this.getProgressBar();
    this.getChartTotalRegisters();
    this.getChartPoints();
    
    setTimeout(() => {
      event.target.complete();
    }, 1000);

    // event.target.complete();
  }

  getActualGroup() {
    this.login.isUserInSession();
    this.groupService.getActiveGroup().subscribe((response) => {
      this.actualGroup = response.actualGroup;

      const actualUser = localStorage.getItem('dietUsernameSession');
      this.actualUserSession = actualUser;

      if(this.actualGroup.boostDay.boostAthlete != null && this.actualGroup.boostDay.boostAthlete != undefined){

        this.isBoostAthlete = this.actualGroup.boostDay.boostAthlete.username;
      }

      this.actualGroup.athletes.forEach((athlete) => {
        this.groupService.getAthlete(athlete).subscribe((res) => {
          let athleteRanking: AthleteRankingInterface = {
            name: res.name,
            point: res.gamePoints,
            roles: res.roles,
            username: res.username,
          };

          /* Se comprueba si el atleta coincide con el usuario actual y si es groupManager */
          if (
            athleteRanking.username == actualUser &&
            athleteRanking.roles.includes('GROUP_MANAGER')
          ) {
            /* Si el atleta es groupManager, se obtienen los registros */
            this.getRegistersToVerify();
          }

          this.athletes.push(athleteRanking);

          if (this.athletes.length > 1) {
            this.athletes = this.athletes.sort(
              (a: AthleteRankingInterface, b: AthleteRankingInterface) => {
                if (a.point < b.point) {
                  return 1;
                }

                if (a.point > b.point) {
                  return -1;
                }

                return 0;
              }
            );
          }
        });
      });
    });

    console.log(this.athletes);
  }

  getRegistersToVerify() {
    // Obtener lista de registros por verificar
    this.groupService.getRegistersToVerify().subscribe((res) => {
      this.registersToVerify = res;
    });
  }

  getRegisters() {
    this.login.isUserInSession();
    this.groupService.getRegisters().subscribe(
      (response) => {
        if (response[0] == null) {
          this.registers = [];
        } else {
          this.registers = response;

          /* Se ordenan los registros por id, si existe más de uno */
          if (this.registers.length > 1) {
            this.sortRegisters();
          }
        }

        this.setNextRegisterDate();

        // Se resetea la diferencia de peso
        this.weightDifference = 0;

        // Se calcula la diferencia de peso, recorriendo todos los registros.
        for (const r of this.registers) {
          this.weightDifference += r.weightDifference;
        }
      },
      (error) => {}
    );
  }

  /* Método que ordena los registros del atleta, por fecha de creación */
  sortRegisters() {
    this.registers.sort((a, b) => {
      if (new Date(a.weightDate) < new Date(b.weightDate)) {
        return 1;
      }

      if (new Date(a.weightDate) > new Date(b.weightDate)) {
        return -1;
      }

      return 0;
    });
  }

  setNextRegisterDate() {
    if (this.registers.length >= 1) {
      this.nextRegisterDate = this.registers[0].nextDateRegister;

      if (new Date(Date.now()) > new Date(Date.parse(this.nextRegisterDate))) {
        this.isRegisterActive = true;
      } else {
        this.isRegisterActive = false;
      }
    }
  }

  getProgressBar() {
    this.login.isUserInSession();
    this.groupService.getProgressBar().subscribe((response) => {
      this.progressBar = response;
    });
  }

  getChartTotalRegisters() {
  
    this.groupService.getChartTotalRegisters().subscribe(res => {
      this.chartData = res;
      let series = res[0].series
      let maxValue = 0;
      let minValue = 999999999;

      for(let s of series){
        if(s.value < minValue){
          minValue = s.value;
        }

        if(s.value > maxValue){
          maxValue = s.value;
        }
      }

      /* this.maxLabelWeightRegister = maxValue;
      this.minLabelWeightRegister = minValue; */
    })
  }

  getChartPoints(){
    this.groupService.getChartPoints().subscribe( response => {
      this.chartPointData = response;
    })
  }

  async getOutGroup() {
    this.login.isUserInSession();

    const alert = await this.alertController.create({
      cssClass: 'alert-danger',
      header: '¡Estás a punto de salir!',
      message: 'Si sales de la actividad <strong>no podrás volver a ella</strong>. Tus puntos se sumarán al total de tu perfil.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Abandonar',
          handler: () => {
            this.showLoading();

            this.groupService.getOutGroup().subscribe((response) => {
              this.router.navigate(['/home']);

              this.loading.dismiss();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  verifyRegister(idRegister: any) {
    // Aceptar registro en la verificación
    this.groupService.verifyRegister(idRegister).subscribe((res) => {
      // Resetear grupo y registros por verificar
      this.resetGroupAndRegistersToVerify();
    });
  }

  declineRegister(idRegister: any) {
    // Denegar registro en la verificación
    this.groupService.declineRegister(idRegister).subscribe((res) => {
      // Resetear grupo y registros por verificar
      this.resetGroupAndRegistersToVerify();
    });
  }

  resetGroupAndRegistersToVerify() {
    /* Resetear grupo */
    this.actualGroup = 'reset';
    this.athletes = [];
    this.getActualGroup();

    /* Resetear registros por verificar */
    this.getRegistersToVerify();
  }

  showLoading() {
    this.presentLoading();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando...',
    });
    await this.loading.present();
  }

}
