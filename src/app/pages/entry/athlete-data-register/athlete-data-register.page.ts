import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AthleteDtoClass } from '../models/athlete-dto';
import { SignUpService } from '../services/sign-up.service';
import { PickerController } from '@ionic/angular'

@Component({
  selector: 'app-athlete-data-register',
  templateUrl: './athlete-data-register.page.html',
  styleUrls: ['./athlete-data-register.page.scss'],
})
export class AthleteDataRegisterPage implements OnInit {
  /* Variable que almacena los datos del atleta, para enviar al backend */
  loginAthleteDto: AthleteDtoClass;

  /* Variable que indica si el peso y la altura es correcta */
  validWeightAndHeight = false;

  /* Altura */
  height: number = -1;

  /* Peso */
  weight: number = -1;

  /* Formulario de atleta */
  athleteForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    birthDay: new FormControl('', Validators.required),
  });

  /* Opciones del picker de fecha */
  datePickerOptions = {
    // Propiedad que obliga al usuario a utilizar los botones del picker
    backdropDismiss: false,
  };

  constructor(
    private signUpService: SignUpService,
    private route: Router,
    public pickerController: PickerController
  ) {}

  ngOnInit() {}

  sendAthleteData() {
    /* Mostrar aviso - cargando */
    Swal.fire({
      title: 'Espere',
      text: 'Se estan guardando sus datos',
      icon: 'info',
      allowOutsideClick: false,
    });
    Swal.showLoading();

    /* inicializar loginAthleteDto */
    this.loginAthleteDto = new AthleteDtoClass('', '', 0, 0);

    /* introducir los datos del formulario en loginAthleteDto */
    this.loginAthleteDto.name = this.athleteForm.value.name;
    this.loginAthleteDto.surname = this.athleteForm.value.surname;
    
    this.loginAthleteDto.birthDay = new Date(
      Date.parse(this.athleteForm.value.birthDay)
    );

    this.loginAthleteDto.weight = this.weight;
    this.loginAthleteDto.height = this.height;


    /* realizar petición para registrar los datos del atleta */
    this.signUpService
      .athleteDataSign(this.loginAthleteDto)
      .subscribe((response) => {
        Swal.fire({
          title: 'Registro de datos',
          text: 'Datos registrados correctamente.',
          icon: 'success',
          input: undefined,
        });
        this.route.navigate(['login']);
      });
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

  async pickerAltura() {
    /* Array de metros y centímetros */
    let metros = [];
    let centimetros = [];

    /* Mínimo y máximo de metros/centímetros disponibles */
    const minMetros = 1;
    const maxMetros = 2;
    const minCentimetros = 0;
    const maxCentimetros = 99;

    /* Se rellena el array de metros */
    for (let i = minMetros; i <= maxMetros; i++) {
      let element = {
        text: `${i} m`,
        value: i,
      };

      metros.push(element);
    }

    /* Se rellena el array de centímetros */
    for (let i = minCentimetros; i <= maxCentimetros; i++) {
      let element = {
        text: `${i} cm`,
        value: i,
      };

      centimetros.push(element);
    }

    /* Controlador del picker para los metros y centímetros */
    const picker = await this.pickerController.create({
      backdropDismiss: false,
      columns: [
        /* Metros */
        {
          name: 'Metros',
          options: metros,
        },
        /* Centímetros */
        {
          name: 'Centimetros',
          options: centimetros,
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
            this.joinHeight(value.Metros.value, value.Centimetros.value);
            
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
    if (this.weight != -1 && this.height != -1) {
      this.validWeightAndHeight = true;
    }
  }

  /* Método que une los metros y centímetros en la variable altura */
  joinHeight(meters:number, centimeters:number) {
    this.height = parseFloat(meters + '.' + centimeters);
  }

  /* Método que une los kilos y gramos en la variable peso */
  joinWeight(kilos:number, grams:number) {
    this.weight = parseFloat(kilos + '.' + grams);
  }
}
