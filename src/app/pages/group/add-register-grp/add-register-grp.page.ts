import { Component, OnInit } from '@angular/core';
import { ModalController, PickerController } from '@ionic/angular';
import { LogInService } from '../../entry/services/log-in.service';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-add-register-grp',
  templateUrl: './add-register-grp.page.html',
  styleUrls: ['./add-register-grp.page.scss'],
})
export class AddRegisterGrpPage implements OnInit {

  /* Peso del registro */
  registerWeight: number = -1;

  /* Variable que indica si el peso es correcto */
  validWeight = false;

  constructor(
    private modalController: ModalController,
    private pickerController: PickerController,
    private groupService: GroupService,
    private login: LogInService
  ) { }

  ngOnInit() {
  }

  exitModal() {
    this.modalController.dismiss();
  }

  async pickerPeso() {
    /* Array de kilos y gramos */
    let kilos = [];
    let gramos = [];

    /* Mínimo y máximo de kilos/gramos disponibles */
    const minKilos = 30;
    const maxKilos = 200;
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
            this.checkValidWeight();
          },
        },
        {
          text: 'Confirmar',
          handler: (value) => {
            // console.log('Confirmar', value);

            /* Se une el peso en una sola variable */
            this.joinWeight(value.Kilos.value, value.Gramos.value)

            /* Se comprueba si el peso y la altura son correctos */
            this.checkValidWeight();
          },
        },
      ],
    });

    await picker.present();
  }

  /* Método que comprueba si el peso y la altura son correctos */
  checkValidWeight() {
    if (this.registerWeight != -1) {
      this.validWeight = true;
    }
  }

  /* Método que une los kilos y gramos en la variable peso */
  joinWeight(kilos:number, grams:number) {
    this.registerWeight = parseFloat(kilos + '.' + grams);
  }

  createClassicRegister() {
    this.login.isUserInSession();

    const register = { weight: this.registerWeight };

    this.groupService.createRegister(register).subscribe((response) => {
      // Salir del modal
      this.exitModal();
    });
  }

}
