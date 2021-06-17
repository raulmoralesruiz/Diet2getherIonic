import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { LogInService } from '../../entry/services/log-in.service';
import { DayRegimeInterface } from '../models/dayRegime.interface';
import { DishInterface } from '../models/dish.interface';
import { RegimeService } from '../services/regime.service';

@Component({
  selector: 'app-select-dish',
  templateUrl: './select-dish.page.html',
  styleUrls: ['./select-dish.page.scss'],
})
export class SelectDishPage implements OnInit {
  @Input() meal: number;

  /* FORMULARIO REACTIVO CON EL PLATO PARA AÑADIRLO A LA DIETA */
   addDishForm = new FormGroup({
    dish: new FormControl('', Validators.required),
  });

  /* Formulario reactivo para la selección del plato */
  selectDishForm = new FormGroup({
    dish: new FormControl('', Validators.required),
    categories: new FormControl('', Validators.required),
  });

  /* Variable que guarda los platos buscados por nombre */
  dishesByName: DishInterface[] = [];

  /* Variable que almacena la dieta del atleta */
  daysRegime: DayRegimeInterface[] = [];

  /* Variable que almacena la lista de categorías seleccionadas */
  selectedCategoriesList: any = [];

  /* Variable que almacena los platos filtrados, para organizar la dieta */
  dishesFiltered: DishInterface[] = [];

  /* Variable que almacena los platos del atleta */
  dishes: DishInterface[] = [];

  loading: HTMLIonLoadingElement;

  constructor(
    private modalController: ModalController,
    private regimeService: RegimeService,
    private login:LogInService,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.login.isUserInSession();


  }

  exitModal() {
    this.modalController.dismiss();
  }

  getDishesByName() {
    this.regimeService
      .getDishesByInitials(this.addDishForm.value.dish)
      .subscribe((response) => {
        if (
          this.addDishForm.value.dish != undefined &&
          this.addDishForm.value.dish != ''
        ) {
          this.dishesByName = response;
        } else {
          this.dishesByName = [];
        }
      });
  }
  
  /* Método que establece un plato a la comida (meal) correspondiente */
  setDishToMeal(e) {

    this.showLoading();

    // Obtener el id del plato
    let dish = e.id;

    this.regimeService
      .addDishToDay(this.meal, dish)
      .subscribe((response) => {
        /* Se refresca la lista de días */
        this.getDayRegime();

        /* Se limpia el formulario de agregar plato a una comida de la dieta */
        this.resetSelectDishForm();

        this.dishesByName = [];
        this.addDishForm.reset();

        this.loading.dismiss();

        this.exitModal();
      });
  }

  getDayRegime() {
    this.regimeService.getDayRegime().subscribe((response) => {
      this.daysRegime = response;
      console.log(response);
    });
  }

  /**
   * Funcion que resetea los valores del formulario en el modal de seleccionar plato
   */
   resetSelectDishForm() {
    /* Se limpia la lista de categorías seleccionadas */
    this.selectedCategoriesList = [];

    /* Se limpia la lista de platos filtrados */
    this.dishesFiltered = [];

    /* Resetear el formulario de añadir amigos */
    this.selectDishForm.reset();
  }

  /* Método que gestiona el checkbox de categorías */
  onCheckboxChangeForSelectDish(e) {
    if (e.target.checked) {
      /* Añadir categoría a la lista de categorías seleccionadas */
      this.selectedCategoriesList.push(e.target.id);

      this.getDishesFiltered();
    } else {
      /* Eliminar categoría de la lista de categorías seleccionadas */
      this.selectedCategoriesList.splice(
        this.selectedCategoriesList.indexOf(e.target.id),
        1
      );

      this.getDishesFiltered();
    }
  }

  /* Obtener platos filtrados por la categoría seleccionada */
  getDishesFiltered() {
    /* resetear lista de platos filtrados */
    this.dishesFiltered = [];

    for (const dish of this.dishes) {
      let categoriesCont = 0;

      for (let category of this.selectedCategoriesList) {
        category = category.slice(2, category.length);

        if (dish.categories.includes(category)) {
          categoriesCont++;
        }

        if (this.selectedCategoriesList.length == categoriesCont) {
          this.dishesFiltered.push(dish);
        }
      }
    }
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

  async dismissLoading() {
    // this.loading.dismiss();
    return await this.loading.dismiss();
  }

}
