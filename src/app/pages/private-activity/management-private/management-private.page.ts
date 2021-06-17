import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, PickerController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { LogInService } from '../../entry/services/log-in.service';
import { PrivateActivityInterface } from '../models/private-activity.interface';
import { PrivateService } from '../services/private.service';

@Component({
  selector: 'app-management-private',
  templateUrl: './management-private.page.html',
  styleUrls: ['./management-private.page.scss'],
})
export class ManagementPrivatePage implements OnInit {

  activityMode: string;
  registerMode: string;

  /* Peso objetivo */
  goalWeight: number = -1;

  /* Variable que indica si el peso es correcto */
  validWeight = false;

  /* Variable que almacena el formulario de actividad privada */
  privateForm: FormGroup;

  /* Opciones del picker de fecha */
  datePickerOptions = {
    // Propiedad que obliga al usuario a utilizar los botones del picker
    backdropDismiss: false,
  };

  loading: HTMLIonLoadingElement;

  constructor(
    private route: Router,
    private build: FormBuilder,
    private login: LogInService,
    private privateService: PrivateService,
    private pickerController: PickerController,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.activityMode = '';
    this.registerMode = '';

    this.login.isUserInSession();
    this.privateForm = this.build.group(
      { expireDate: ['', [Validators.required, this.validateGroupExpireDate]] },
      { validator: this.validateGroupExpireDate('expireDate') }
    );
  }

  changeActivityMode(toChange: string) {
    this.activityMode = toChange;
  }

  changeRegisterMode(toChange: string) {
    this.registerMode = toChange;
  }

  /* Método que valida la fecha de expiración/objetivo */
  private validateGroupExpireDate(control: string) {
    return (formGroup: FormGroup) => {
      const expireDateForm = formGroup.controls[control];

      let weekInMs = 1000 * 60 * 60 * 24 * 7;
      let actualDate = new Date(Date.now());
      let dateLimitOneMonth = new Date(actualDate.getTime() + weekInMs * 4);

      if (new Date(Date.parse(expireDateForm.value)) > dateLimitOneMonth) {
        expireDateForm.setErrors(null);
      } else {
        expireDateForm.setErrors({ passwordMismatch: true });
      }
    };
  }

  /* Método que crea la actividad privada */
  createPrivateActivity() {

    // Se muestra el aviso de carga
    this.showLoading();

    // Se recoge la información del formulario
    let backendForm: PrivateActivityInterface = {
      expireDate: new Date(Date.parse(this.privateForm.value.expireDate)),
      weightObjective: this.goalWeight,
      privateActivityMode: this.activityMode,
      privateRegisterMode: this.registerMode,
    };

    // Se envía la información al backend, a través del servicio
    this.privateService.createPrivateActivity(backendForm).subscribe(
      (group) => {
        // Se elimina el aviso de carga
        this.loading.dismiss();

        this.privateForm.reset();

        this.route.navigate(['/private/privateview']);
        // this.route.navigate(['/private/welcome']);

      },
      (error) => {
        Swal.fire({
          title: 'ERROR',
          text: error.error.message,
          icon: 'error',
          input: undefined,
        });
      }
    );
  }

  async pickerPeso() {
    /* Array de kilos y gramos */
    let kilos = [];
    let gramos = [];

    /* Mínimo y máximo de kilos/gramos disponibles */
    const minKilos = 1;
    const maxKilos = 300;
    const minGramos = 0;
    const maxGramos = 95;

    /* Se rellena el array de kilos */
    for (let i = minKilos; i <= maxKilos; i++) {
      let element = {
        text: `${i} kg`,
        value: i,
      };

      kilos.push(element);
    }

    /* Se rellena el array de gramos */
    for (let i = minGramos; i <= maxGramos; i += 5) {
      let element = {
        text: `${i * 10} gr`,
        value: i,
      };

      gramos.push(element);
    }

    /* Controlador del picker para los kilos y gramos */
    const picker = await this.pickerController.create({
      backdropDismiss: false,
      columns: [
        /* kilos */
        {
          name: 'Kilos',
          options: kilos,
        },
        /* gramos */
        {
          name: 'Gramos',
          options: gramos,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: (value) => {
            // console.log('Cancelar', value);

            /* Se comprueba si el peso y la altura son correctos */
            this.checkValidWeightAndHeight();
          },
        },
        {
          text: 'Confirmar',
          handler: (value) => {
            // console.log('Confirmar', value);

            /* Se une el peso en una sola variable */
            this.joinWeight(value.Kilos.value, value.Gramos.value)

            /* Se comprueba si el peso y la altura son correctos */
            this.checkValidWeightAndHeight();
          },
        },
      ],
    });

    await picker.present();
  }

  /* Método que comprueba si el peso y la altura son correctos */
  checkValidWeightAndHeight() {
    if (this.goalWeight != -1) {
      this.validWeight = true;
    }
  }

  /* Método que une los kilos y gramos en la variable peso */
  joinWeight(kilos:number, grams:number) {
    this.goalWeight = parseFloat(kilos + '.' + grams);
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
