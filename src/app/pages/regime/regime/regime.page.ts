import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonSegment, IonSlides, LoadingController, ModalController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { LogInService } from '../../entry/services/log-in.service';
import { DayRegimeInterface } from '../models/dayRegime.interface';
import { DishInterface } from '../models/dish.interface';
import { DishCategoryInterface } from '../models/dishCategory.interface';
import { RegimeService } from '../services/regime.service';
import { SelectDishPage } from '../select-dish/select-dish.page';
import { CreateDishPage } from '../create-dish/create-dish.page';

@Component({
  selector: 'app-regime',
  templateUrl: './regime.page.html',
  styleUrls: ['./regime.page.scss'],
})
export class RegimePage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(IonSegment) segment: IonSegment;
  
  /* Variable que almacena la pestaña activa: mi dieta o mis platos */
  activeMenuTab: string; // showMenu

  /* Variable que guarda los platos buscados por nombre */
  dishesByName: DishInterface[] = [];

  /* Variable que almacena los platos del atleta */
  dishes: DishInterface[] = [];

  /* Variable que almacena la dieta del atleta */
  daysRegime: DayRegimeInterface[] = [];

  /* Variable que almacena las categorías de los platos */
  dishesCategories: DishCategoryInterface[] = [];

  /* Variable que almacena la lista de categorías seleccionadas */
  selectedCategoriesList: any = [];

  /* Formulario reactivo para la creación del plato */
  createDishForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    categories: new FormControl('', Validators.required),
  });

  /* Formulario reactivo para la selección del plato */
  selectDishForm = new FormGroup({
    dish: new FormControl('', Validators.required),
    categories: new FormControl('', Validators.required),
  });

  /* Variable que almacena los platos filtrados, para organizar la dieta */
  dishesFiltered: DishInterface[] = [];

  idSelectedMeal;

  loading: HTMLIonLoadingElement;

  /**
   * FORMULARIO REACTIVO CON EL PLATO PARA AÑADIRLO A LA DIETA
   */
  addDishForm = new FormGroup({
    dish: new FormControl('', Validators.required),
  });

  actualSlide: number;

  constructor(
    private regimeService: RegimeService,
    private login: LogInService,
    private modalController: ModalController,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.login.isUserInSession();
    /* Pestaña por defecto - Mi dieta */
    this.activeMenuTab = 'regime';

    /* obtener los platos del atleta */
    this.getDishes();

    /* obtener los días (dieta) del atleta */
    this.getDayRegime();

    /* obtener las categorías de los platos */
    this.getCategoriesOfDishes();
  }

  changeMenuTab(toChange: string) {
    this.activeMenuTab = toChange;

    if (toChange == 'regime') {
      this.slides.slideTo(0);
    }
    
    if (toChange == 'dishes') {
      this.slides.slideTo(1);
    }
  }

  changeSlide() {
    this.slides.getActiveIndex().then(index => {
      this.actualSlide = index;

      if (index == 0) {
        this.changeMenuTab('regime');
        this.segment.value = 'regime'
      }
      
      if (index == 1) {
        this.changeMenuTab('dishes');
        this.segment.value = 'dishes'
      }
    });
  }

  segmentChanged() {
    let toChange = this.segment.value;

    if (toChange == 'regime') this.slides.slideTo(0);
    if (toChange == 'dishes') this.slides.slideTo(1);
  }

  /**
   * Funcion que resetea los valores del formulario en el modal de crear plato
   */
   resetCreateDishForm() {
    /* Se limpia la lista de categorías seleccionadas */
    this.selectedCategoriesList = [];

    /* Resetear el formulario de añadir amigos */
    this.createDishForm.reset();
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

  getDishes() {
    this.regimeService.getDishesByUsername().subscribe((response) => {
      this.dishes = response;
    });
  }

  getDayRegime() {
    this.regimeService.getDayRegime().subscribe((response) => {
      

      this.daysRegime = response;
    });
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

  /* Método que crea un plato nuevo */
  createDish() {
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
    });
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

  /* Método que crea la estructura de la dieta */
  createRegimeStructure() {

    this.showLoading();
    
    this.regimeService.createRegimeStructure().subscribe((response) => {
      /* Se refresca la lista de dias (estructura de la dieta) */
      this.getDayRegime();

      this.loading.dismiss();
    });
  }

  addIconToCategory(category: string): string {
    switch (category) {
      case 'DAYRY':
        return 'cog-outline';

      case 'MEAT':
        return 'cog-outline';

      case 'FISH':
        return 'cog-outline';

      case 'EGG':
        return 'cog-outline';

      case 'VEGETABLE':
        return 'cog-outline';

      case 'NUT':
        return 'cog-outline';

      case 'POTATO':
        return 'cog-outline';

      case 'FRUIT':
        return 'cog-outline';

      case 'CEREAL':
        return 'cog-outline';

      default:
    }
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

  /* Método que establece un plato a la comida (meal) correspondiente */
  setDishToMeal(e) {
    // Obtener el id del plato
    let dish = e.id;

    this.regimeService
      .addDishToDay(this.idSelectedMeal, dish)
      .subscribe((response) => {
        /* Se refresca la lista de días */
        this.getDayRegime();

        /* Se limpia el formulario de agregar plato a una comida de la dieta */
        this.resetSelectDishForm();

        this.dishesByName = [];
        this.addDishForm.reset();
      });
  }

  /* Método que establece el id de la comida (meal) seleccionada */
  setMeal(mealId: any) {
    this.idSelectedMeal = mealId;
  }

  /* Método que cambia la visibilidad de los platos, para mostrar los detalles */
  toggleDisplay(e) {
    console.log(e);
    let cardBody = e.target.nextSibling;

    if (cardBody.classList.contains('d-none')) {
      cardBody.classList.remove('d-none');
    } else {
      cardBody.classList.add('d-none');
    }
  }

  async showModalSelectDish(mealId: number) {
    const modal = await this.modalController.create({
      component: SelectDishPage,
      componentProps: {
        meal: mealId,
      }
    });

    await modal.present();

    // onDidDismiss actúa cuando la animación del modal termina, después de tocar el botón
    // const {data} = await modal.onDidDismiss();

    // onDidDismiss actúa inmediatamente cuando se toca el botón
    const {data} = await modal.onWillDismiss();
    
    console.log(data);

    /* obtener los platos del atleta */
    this.getDishes();

    /* obtener los días (dieta) del atleta */
    this.getDayRegime();
  }

  async showModalCreateDish() {
    const modal = await this.modalController.create({
      component: CreateDishPage,
    });

    await modal.present();

    // onDidDismiss actúa cuando la animación del modal termina, después de tocar el botón
    // const {data} = await modal.onDidDismiss();

    // onDidDismiss actúa inmediatamente cuando se toca el botón
    const {data} = await modal.onWillDismiss();
    
    console.log(data);

    /* obtener los platos del atleta */
    this.getDishes();

    /* obtener los días (dieta) del atleta */
    this.getDayRegime();
  }


  doRefresh(event) {
    console.log('Begin async operation');
    
    /* obtener los platos del atleta */
    this.getDishes();

    /* obtener los días (dieta) del atleta */
    this.getDayRegime();

    /* obtener las categorías de los platos */
    this.getCategoriesOfDishes();
    
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);

    // event.target.complete();
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
