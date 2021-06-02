import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { UserSignUpDto } from '../models/signup-user-dto';
import { SignUpClass } from '../models/singup.class';
import { SignUpService } from '../services/sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  singUpClass: SignUpClass;
  userSignUpDto: UserSignUpDto;

  /* Variable utilizada para ocultar la contraseña */
  hidePass = true;
  hideRepeatPass = true;

  loading: HTMLIonLoadingElement;

  constructor(
    private signUpService: SignUpService,
    private route: Router,
    private alertController: AlertController,
    public loadingController: LoadingController
    ) {
    this.singUpClass = new SignUpClass("", "", "");
    this.userSignUpDto = new UserSignUpDto("","");
  }  

  ngOnInit() {
  }

  onSubmit(formData: any) {

    this.showLoading();

    this.userSignUpDto.username = formData.username;
    this.userSignUpDto.password = formData.password;

    this.signUpService.userSignUp(this.userSignUpDto).subscribe((response)=>{
      console.log("this.loading...");
      console.log(this.loading);
      this.loading.dismiss();

      localStorage.setItem('dietUsername',response.username);

      this.showAlertCreateUserOK();

      this.route.navigate(['athlete']);
    }, error => {
      console.log("this.loading...");
      console.log(this.loading);
      this.loading.dismiss();
      
      // Quitar aviso cargando -> this.loading.dismiss();
      // https://www.it-swarm-es.com/es/ionic-framework/ionic-error-no-capturado-en-promesa-removeview-no-se-encontro/832603559/

      this.showAlertCreateUserError(error.error.message);
    });
  }


  async showAlertSavingData() {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: `Espere!`,
      subHeader: `Un momento, por favor.`,
      message: 'Se están guardando sus datos.',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async showAlertCreateUserOK() {

    const alert = await this.alertController.create({
      backdropDismiss: false,
      cssClass: 'my-custom-class',
      header: `Registro creado!`,
      subHeader: `Usuario: ${this.userSignUpDto.username}`,
      message: 'Registro realizado correctamente',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async showAlertCreateUserError(error: string) {

    const alert = await this.alertController.create({
      backdropDismiss: false,
      cssClass: 'my-custom-class',
      header: `Error!`,
      subHeader: `Usuario: ${this.userSignUpDto.username}`,
      message: `${error}`,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  // async presentLoading() {
  //   const loading = await this.loadingController.create({
  //     cssClass: 'my-custom-class',
  //     message: 'Please wait...',
  //     duration: 2000
  //   });
  //   await loading.present();

  //   const { role, data } = await loading.onDidDismiss();
  //   console.log('Loading dismissed!');
  // }

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
