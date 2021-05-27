import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private signUpService: SignUpService, private route: Router) {
    this.singUpClass = new SignUpClass("", "", "");
    this.userSignUpDto = new UserSignUpDto("","");
  }

  ngOnInit() {
  }

  onSubmit(formData: any) {

    Swal.fire({
      title: 'Espere',
      text: 'Se estan guardando sus datos',
      icon: 'info',
      allowOutsideClick: false,
    });
    Swal.showLoading();

    this.userSignUpDto.username = formData.username;
    this.userSignUpDto.password = formData.password;

    this.signUpService.userSignUp(this.userSignUpDto).subscribe((response)=>{

      localStorage.setItem('dietUsername',response.username);
      Swal.fire({
        title: 'Creado el usuario '+ this.userSignUpDto.username,
        text:'Registro realizado correctamente.',
        icon:'success',
        input:undefined
      });

      this.route.navigate(['athlete']);
    }, error => {
      Swal.fire({
        title: "ERROR",
        text: error.error.message,
        icon:'error',
        input:undefined
      });
    });
  }

}
