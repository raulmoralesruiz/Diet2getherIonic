import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FriendsService } from '../services/friends.service';
import { LogInService } from '../../entry/services/log-in.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.page.html',
  styleUrls: ['./add-friend.page.scss'],
})
export class AddFriendPage implements OnInit {
  // @Input() nombre: string;
  // @Input() pais: string;

  /* VARIABLES QUE SE USAN EN EL COMPONENTE */
  // Amigos que se obtienen en la busqueda del modal de solicitudes de amistad
  searchFriends: any = [];
  // Amigos del usuario logeado
  userFriends: any = [];
  // Solicitudes de amistad del usuario logeado
  friendRequests: any = [];
  // Solicitudes de grupo del usuario logeado
  groupRequests: any = [];

  /* FORMULARIO REACTIVO CON EL USUARIO PARA MANDAR SOLICITUDES DE AMISTAD */
  searchFriendForm = new FormGroup({
    username: new FormControl('', Validators.required),
  });

  constructor(
    private modalController: ModalController,
    private friendService: FriendsService,
    private login:LogInService
  ) {}

  ngOnInit() {
    this.login.isUserInSession();
    /**
     * Funcion para obtener los amigos del usuario logeado
     */
    this.getFriends();
    /**
     * Funcion para obtener las solicitudes de amistad del usuario logeado
     */
    this.getFriendRequests();
    /**
     * Funcion para obtener las solicitudes de grupo del usuario logeado
     */
    this.getGroupRequests();
  }

  exitModal() {
    this.modalController.dismiss();
  }

  // exitModalWithInfo() {
  //   this.modalController.dismiss({
  //     nombre: 'Pepito',
  //     pais: 'EEUU',
  //   });
  // }

  /**
   * Obtener usuarios por sus iniciales. Solo te aparecen si no son tus amigos
   */
  getUsernameByInitials() {
    console.log("get by initials...");
    console.log(this.searchFriendForm);
    console.log("username: " + this.searchFriendForm.value.username);

    let selfUsername = localStorage.getItem('dietUsernameSession');
    let auxFriends = [];
    if (
      this.searchFriendForm.value.username != undefined &&
      this.searchFriendForm.value.username != ''
    ) {
      this.friendService
        .getUsernamesByInitials(this.searchFriendForm.value.username)
        .subscribe((res) => {
          auxFriends = res;
          console.log("auxFriends: " + auxFriends);

          for (let username of this.userFriends) {
            if (auxFriends.includes(username)) {
              auxFriends.splice(auxFriends.indexOf(username), 1);
            }

            if (auxFriends.includes(selfUsername)) {
              auxFriends.splice(auxFriends.indexOf(selfUsername), 1);
            }
          }
          this.searchFriends = auxFriends;
        });
    } else {
      this.searchFriends = [];
      console.log("entra en else");
    }
  }

  /**
   * Funcion para obtener los amigos del usuario logeado
   */
  getFriends() {
    this.friendService.getFriends().subscribe((res) => {
      this.userFriends = res;

      console.log("userFriends");
      console.log(res);
    });
  }

  /**
   * Funcion para obtener las solicitudes de amistad del usuario logeado
   */
   getFriendRequests() {
    this.friendService.getFriendRequests().subscribe((res) => {
      let aux = [];

      for (const request in res) {
        if (res[request].requestStatus == 'PENDING') {
          aux.push(res[request]);
        }
      }

      this.friendRequests = aux;

      console.log("friendRequests");
      console.log(this.friendRequests);
    });
  }

  /**
   * Funcion para obtener las solicitudes de grupo del usuario logeado
   */
  getGroupRequests() {
    this.friendService.getGroupRequests().subscribe((res) => {
      let aux = [];

      for (const request in res) {
        if (res[request].requestStatus == 'PENDING') {
          aux.push(res[request]);
        }
      }

      this.groupRequests = aux;

      console.log("groupRequests");
      console.log(this.groupRequests);
    });
  }

    /**
   * Funcion para mandar una solicitud de amistad al usuario seleccionado
   * @param username 
   */
     sendFriendRequest(username: string) {

      Swal.fire({
        title: 'Espere',
        text: 'Se esta mandando su solicitud',
        icon: 'info',
        allowOutsideClick: false,
      });
      Swal.showLoading();
  
      this.friendService.sendFriendRequest(username).subscribe(res => {
        
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
  
        this.getFriendRequests();
  
        Toast.fire({
          icon: 'success',
          title: 'Se ha enviado la solicitud a ' + username
        });
  
        this.resetAddFriendForm();
        this.exitModal();
  
      }, error => {
  
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
  
        Toast.fire({
          icon: 'error',
          title: error.error.message
        });
  
      });
    }

    /**
   * Funcion que resetea los valores del formulario en el modal de mandar solicitudes de amistad
   */
  resetAddFriendForm() {
    /* Borrar la lista de amigos, para que no aparezcan amigos ya agregados al abrir el modal */
    this.searchFriends = [];

    /* Resetear el formulario de añadir amigos */
    this.searchFriendForm.reset();
  }
}
