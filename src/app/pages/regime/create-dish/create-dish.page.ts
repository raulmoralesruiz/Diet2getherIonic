import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { LogInService } from '../../entry/services/log-in.service';
import { DishInterface } from '../models/dish.interface';
import { DishCategoryInterface } from '../models/dishCategory.interface';
import { RegimeService } from '../services/regime.service';

@Component({
  selector: 'app-create-dish',
  templateUrl: './create-dish.page.html',
  styleUrls: ['./create-dish.page.scss'],
})
export class CreateDishPage implements OnInit {
  
  /* Variable que almacena las categorías de los platos */
  dishesCategories: DishCategoryInterface[] = [];

  /* Variable que almacena la lista de categorías seleccionadas */
  selectedCategoriesList: any = [];

  /* Variable que almacena los platos del atleta */
  dishes: DishInterface[] = [];

  /* Formulario reactivo para la creación del plato */
  createDishForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    categories: new FormControl('', Validators.required),
  });

  loading: HTMLIonLoadingElement;

  constructor(
    private modalController: ModalController,
    private regimeService: RegimeService,
    private login: LogInService,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    /* obtener las categorías de los platos */
    this.getCategoriesOfDishes();
  }

  exitModal() {
    this.modalController.dismiss();
  }

  /* Método que gestiona el checkbox de categorías */
  onCheckboxChange(e) {
    if (e.target.checked) {
      /* Añadir categoría a la lista de categorías seleccionadas */
      this.selectedCategoriesList.push(e.target.id);
    } else {
      /* Eliminar categoría de la lista de categorías seleccionadas */
      this.selectedCategoriesList.splice(
        this.selectedCategoriesList.indexOf(e.target.id),
        1
      );
    }
  }

  /* Método que crea un plato nuevo */
  createDish() {
    
    this.showLoading();

    let dish: DishInterface = {
      name: this.createDishForm.value.name,
      description: this.createDishForm.value.description,
      categories: this.selectedCategoriesList,
    };

    this.regimeService.createDish(dish).subscribe((response) => {
      /* Se refresca la lista de platos */
      this.getDishes();

      /* Se resetea el formulario */
      this.resetCreateDishForm();

      /* Se limpia la lista de categorías seleccionadas */
      this.selectedCategoriesList = [];

      this.loading.dismiss();

      this.exitModal();
    });
  }

  getDishes() {
    this.regimeService.getDishesByUsername().subscribe((response) => {
      this.dishes = response;
    });
  }

  /* Funcion que resetea los valores del formulario en el modal de crear plato */
   resetCreateDishForm() {
    /* Se limpia la lista de categorías seleccionadas */
    this.selectedCategoriesList = [];

    /* Resetear el formulario de añadir amigos */
    this.createDishForm.reset();
  }

  getCategoriesOfDishes() {
    this.dishesCategories = [
      {
        name: '0_name', // DAYRY - lacteos
        icon: 'fas fa-cheese fa-2x',
      },
      {
        name: '1_name', // MEAT - carne
        icon: 'fas fa-drumstick-bite fa-2x',
      },
      {
        name: '2_name', // FISH - pescado
        icon: 'fas fa-fish fa-2x',
      },
      {
        name: '3_name', // EGG - huevo
        icon: 'fas fa-egg fa-2x',
      },
      {
        name: '4_name', // VEGETABLE - verdura
        icon: 'fas fa-carrot fa-2x',
      },
      {
        name: '5_name', // NUT - frutos secos
        icon: 'fas fa-seedling fa-2x',
      },
      {
        name: '6_name', // POTATO - patata
        icon: 'fab fa-product-hunt fa-2x',
      },
      {
        name: '7_name', // FRUIT - frutas
        icon: 'fas fa-apple-alt fa-2x',
      },
      {
        name: '8_name', // CEREAL - cereales
        icon: 'fas fa-bread-slice fa-2x',
      },
    ];

    this.regimeService.getMealCategories().subscribe((response) => {
      for (let i = 0; i < response.length; i++) {
        const category = response[i];
        this.dishesCategories[i].name = category;
      }
    });
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
