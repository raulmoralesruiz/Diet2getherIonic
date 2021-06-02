import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, IonSlides, IonSegment } from '@ionic/angular';
import { LogInService } from '../../entry/services/log-in.service';
import { PrivateService } from '../services/private.service';
import { AddRegisterPrvPage } from '../add-register-prv/add-register-prv.page';

@Component({
  selector: 'app-view-private',
  templateUrl: './view-private.page.html',
  styleUrls: ['./view-private.page.scss'],
})
export class ViewPrivatePage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(IonSegment) segment: IonSegment;
  
  /* Variable que almacena la pestaña activa: estado, registros o diario */
  activeMenuTab: string;

  /* Variable que almacena la barra de progreso */
  progressBar: any = '';

  /* Variable que almacena la actividad privada actual */
  actualPrivateActivity: any;

  /* Variable que almacena el ranking del atleta */
  athleteRanking: any;

  /* Variable que almacena el modo de registro: clásico o progresivo */
  registerMode: any;

  /* Variable que almacena los registros del modo clásico */
  registersClassicMode: any = [];

  isRegisterActive: boolean = true;

  nextRegisterDate: any;

  weightDifference = 0;

  actualPage: number = 1;

  /* Variable que almacena los registros del modo progresivo */
  registersProgressiveMode: any = [];

  /* Variable que almacena el formulario para añadir un registro */
  addRegisterForm = new FormGroup({
    weightKilograms: new FormControl('', [
      Validators.required, // requerido
      Validators.pattern('^[0-9]*$'), // números válidos, del 0 al 9
      Validators.minLength(1), // número mínimo de caracteres, 1
      Validators.maxLength(3), // número máximo de caracteres, 3
      Validators.min(1), // valor mínimo, 1
      Validators.max(300), // valor máximo, 300
    ]),
    weightGrams: new FormControl('', [
      Validators.required, // requerido
      Validators.pattern('^[0-9]*$'), // números válidos, del 0 al 9
      Validators.minLength(1), // número mínimo de caracteres, 1
      Validators.maxLength(3), // número máximo de caracteres, 3
    ]),
  });

  constructor(
    private privateService: PrivateService,
    private router: Router,
    private login: LogInService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.activeMenuTab = 'estado';

    this.getProgressBar();

    this.getActivePrivateActivity();

    this.getAthleteRanking();
  }

  segmentChanged(event) {
    console.log(event);
  }

  changeMenuTab(toChange: string) {
    this.activeMenuTab = toChange;

    if (toChange == 'estado') {
      this.slides.slideTo(0);
    }
    
    if (toChange == 'diario') {
      this.slides.slideTo(1);
    }
    
    if (toChange == 'registros') {
      this.slides.slideTo(2);
    }
  }

  changeSlide() {
    this.slides.getActiveIndex().then(index => {
      console.log(index);

      if (index == 0) {
        // this.activeMenuTab = 'estado'
        this.changeMenuTab('estado');
        this.segment.value = 'estado'
      }

      
      if (index == 1) {
        // this.activeMenuTab = 'diario'
        this.changeMenuTab('diario');
        this.segment.value = 'diario'
      }

      if (index == 2) {
        // this.activeMenuTab = 'registros'
        this.changeMenuTab('registros');
        this.segment.value = 'registros'
      }
    });
  }

  getProgressBar() {
    this.login.isUserInSession();
    this.privateService.getProgressBar().subscribe((response) => {
      this.progressBar = response;
      console.log(response);
    });
  }

  /* Método que obtiene la actividad privada actual */
  getActivePrivateActivity() {
    this.login.isUserInSession();
    this.privateService.getPrivateActivity().subscribe(res => {
      this.actualPrivateActivity = res;
      this.registerMode = res.registerMode;

      if (this.actualPrivateActivity.totalRegisters != null) {
        this.registersClassicMode = this.actualPrivateActivity.totalRegisters;

        /* Se ordenan los registros por id, si existe más de uno */
        if (this.registersClassicMode.length > 1) {
          this.sortRegisters(this.registersClassicMode);
        }

        this.setNextRegisterDate(this.registersClassicMode);
      }

      if (this.actualPrivateActivity.daylyRegisters != null) {
        this.registersProgressiveMode = this.actualPrivateActivity.daylyRegisters;

        /* Se ordenan los registros por id, si existe más de uno */
        if (this.registersProgressiveMode.length > 1) {
          this.sortRegisters(this.registersProgressiveMode);
        }

        this.setNextRegisterDate(this.registersProgressiveMode);
      }

      // Se resetea la diferencia de peso
      this.weightDifference = 0;

      this.calculateWeightDifference(this.registersClassicMode);
      
    });
  }

  /* Método que obtiene el ranking del atleta */
  getAthleteRanking() {
    this.privateService.getAthleteRanking().subscribe(res => {
      this.athleteRanking = res;
    });
  }

  setNextRegisterDate(registers: any) {
    if (registers.length >= 1) {
      this.nextRegisterDate = registers[0].nextDateRegister;

      if (new Date(Date.now()) > new Date(Date.parse(this.nextRegisterDate))) {
        this.isRegisterActive = true;
      } else {
        this.isRegisterActive = false;
      }
    }
  }

  resetAddRegisterForm() {
    this.addRegisterForm.reset();
  }

  createClassicRegister() {
    this.login.isUserInSession();
    
    const kilograms = this.addRegisterForm.value.weightKilograms;
    const grams = this.addRegisterForm.value.weightGrams;

    const register = {
      weight: parseFloat(kilograms + '.' + grams),
    };

    this.privateService.createRegister(register).subscribe((response) => {
      this.getActivePrivateActivity();
      this.getAthleteRanking();
    });
  }

  /* Método que ordena los registros del atleta, por fecha de creación */
  sortRegisters(registers: any) {
    registers.sort((a, b) => {
      if (new Date(a.weightDate) < new Date(b.weightDate)) {
        return 1;
      }

      if (new Date(a.weightDate) > new Date(b.weightDate)) {
        return -1;
      }

      return 0;
    });
  }

  calculateWeightDifference(registers: any) {
    for (const r of registers) {
      this.weightDifference += r.weightDifference;
    }
  }

  getOutActivity() {
    console.log("pendiente getOutActivity");
  }

  async showModal() {
    this.resetAddRegisterForm(); 

    const modal = await this.modalController.create({
      component: AddRegisterPrvPage,
    });

    await modal.present();

    // onDidDismiss actúa cuando la animación del modal termina, después de tocar el botón
    // const {data} = await modal.onDidDismiss();

    // onDidDismiss actúa inmediatamente cuando se toca el botón
    const {data} = await modal.onWillDismiss();
    
    console.log(data);
    
    // Ejecutar después del modal
    this.getActivePrivateActivity();
    this.getAthleteRanking();
  }  
  
}
