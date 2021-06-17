import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonSegment, IonSlides } from '@ionic/angular';
import { LogInService } from '../../entry/services/log-in.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(IonSegment) segment: IonSegment;

  /* Variable que almacena la pestaña activa */
  activeMenuTab: string;

  /* Variable que almacena la pantalla (slide) activa */
  actualSlide: number = 0;

  /* Variable que almacena el usuario activo */
  actualUser: string;

  /* Variable que almacena el atleta actual */
  actualAthlete: any;

  athleteName: any = '';
  athleteSurname: any = '';
  athleteBirthday: any = '';
  athleteTotalPoints: any = -1;
  athleteIMC: any = '';
  athleteActualScale: any = '';
  athleteScales: any = [];
  athleteHeight: any = '';
  athleteWeight: any = '';

  /** Grafica para baremos del atleta */
  chartScaleData;

  /** Grafica para puntacion total */
  totalPoints;
  textValue = 'puntos';

  /** Grafica para registros totales */
  chartData: any[];
  labelX = 'Fechas';
  labelY = 'Pesos';
  maxLabelWeightRegister;
  minLabelWeightRegister;

  /** Grafica para registros en diferencias de peso totales */
  chartWeightDifferenceData: any[];
  labelXWeightDifference = 'Fechas';
  labelYWeightDifference = 'Diferencias';
  maxLabelWeightDifferenceRegister;
  minLabelWeightDifferenceRegister;

  profileFormLocked: boolean = true;

  readOnly: boolean = true;
  textColor: string = "";
  clearInput: boolean = false;

  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    birthday: new FormControl('', Validators.required),
    // height: new FormControl({value: '', disabled: true}, Validators.required),
  });

  /* Opciones del picker de fecha */
  datePickerOptions = {
    // Propiedad que obliga al usuario a utilizar los botones del picker
    backdropDismiss: false,
  };

  constructor(
    private profileService: ProfileService,
    private login: LogInService
  ) {}

  ngOnInit() {
    this.actualUser = localStorage.getItem('dietUsernameSession');

    /* Guard. Comprobar si el usuario tiene sesión activa */
    this.login.isUserInSession();

    this.getActualAthlete();
    this.getChartTotalRegisters();
    this.getChartTotalWeightDifferenceRegisters();
  }

  changeMenuTab(toChange: string) {
    this.activeMenuTab = toChange;

    if (toChange == 'personal') {
      this.slides.slideTo(0);
    }

    if (toChange == 'imc') {
      this.slides.slideTo(1);
    }

    if (toChange == 'scales') {
      this.slides.slideTo(2);
    }

    if (toChange == 'stats') {
      this.slides.slideTo(3);
    }
  }

  changeSlide() {
    this.slides.getActiveIndex().then((index) => {
      this.actualSlide = index;

      if (index == 0) {
        this.changeMenuTab('personal');
        this.segment.value = 'personal';
      }

      if (index == 1) {
        this.changeMenuTab('imc');
        this.segment.value = 'imc';
      }

      if (index == 2) {
        this.changeMenuTab('scales');
        this.segment.value = 'scales';
      }

      if (index == 3) {
        this.changeMenuTab('stats');
        this.segment.value = 'stats';
      }
    });
  }

  /* Método que obtiene el atleta actual */
  getActualAthlete() {
    this.login.isUserInSession();
    this.profileService.getAthlete().subscribe((res) => {
      this.actualAthlete = res;

      this.athleteName = res.name;
      this.athleteSurname = res.surname;
      this.athleteBirthday = res.birthDay;
      this.athleteTotalPoints = res.totalPoints;
      this.athleteIMC = res.physicalData.imc.imcValue;
      this.athleteActualScale = res.physicalData.imc.actualScale;
      this.athleteScales = res.physicalData.imc.scales;
      this.athleteHeight = res.physicalData.height;
      this.athleteWeight = res.physicalData.weight;
      this.totalPoints = res.totalPoints;

      let chartScaleData = [];

      for (let scale of res.physicalData.imc.scales) {
        let scaleData = {
          name: scale.scale,
          value: scale.weightScale,
        };

        chartScaleData.push(scaleData);
      }

      this.chartScaleData = chartScaleData;
    });
  }

  getChartTotalRegisters() {
    this.profileService.getChartTotalRegisters().subscribe((res) => {
      console.log(res);
      this.chartData = res;
      let series = res[0].series;
      console.log(series);
      let maxValue = 0;
      let minValue = 999999999;

      for (let s of series) {
        if (s.value < minValue) {
          minValue = s.value;
        }

        if (s.value > maxValue) {
          maxValue = s.value;
        }
      }

      this.maxLabelWeightRegister = maxValue;
      this.minLabelWeightRegister = minValue;
    });
  }

  getChartTotalWeightDifferenceRegisters() {
    this.profileService
      .getChartTotalWeightDifferenceRegisters()
      .subscribe((res) => {
        console.log(res);
        this.chartWeightDifferenceData = res;
        let series = res[0].series;
        console.log(series);
        let maxValue = -99999999999;
        let minValue = 999999999;

        for (let s of series) {
          if (s.value < minValue) {
            minValue = s.value;
          }

          if (s.value > maxValue) {
            maxValue = s.value;
          }
        }

        this.maxLabelWeightDifferenceRegister = maxValue;
        this.minLabelWeightDifferenceRegister = minValue;
      });
  }

  /* Establecer formulario ProfileForm como modificable */
  setProfileFormToModify() {
    
    this.isChangeable();

    /* Convertir el tipo del campo birtdate, de string a date */
    // this.birthdateStringToDate();

    /* Desbloquear o bloquear formulario de perfil */
    this.unlockOrBlockProfileForm();
  }

  /* Método auxiliar que cambia el estado del formulario ProfileForm (bloqueado o desbloqueado) */
  unlockOrBlockProfileForm() {
    this.profileFormLocked == true ? (this.profileFormLocked = false) : (this.profileFormLocked = true);
  }

  isChangeable() {
    this.readOnly == true ? this.readOnly = false : this.readOnly = true;
    this.textColor == "" ? this.textColor = "primary" : this.textColor = "";
    this.clearInput == false ? this.clearInput = true : this.clearInput = false;
  }

  /* Enviar los datos modificados del formulario sendProfileForm */
  sendProfileForm() {
    const data = {
      name: this.profileForm.get('name').value,
      surname: this.profileForm.get('surname').value,
      birthday: new Date(Date.parse(this.profileForm.get('birthday').value))
    };

    console.log(data);

    this.profileService.updateProfileData(data).subscribe((res) => {
      this.getActualAthlete();

      this.setProfileFormToModify();
    });

    this.profileForm.reset();
  }
}
