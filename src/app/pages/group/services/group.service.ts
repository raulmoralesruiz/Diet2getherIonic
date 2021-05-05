import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment, urlServer } from 'src/environments/environment';
import { urlServerProd } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  endPointServer = '';

  constructor(private http: HttpClient) {
    if (!environment.production) {
      this.endPointServer = urlServer.url;
    } else {
      this.endPointServer = urlServerProd.url;
    }
  }

  getAthlete(username: string): Observable<any> {
    /* Obtener token JWT del usuario actual */
    const jwt = localStorage.getItem('dietJwtSession');

    /* Dirección del servidor - petición */
    const endpoint = this.endPointServer + `/athlete/get-athlete-ranking/${username}`;

    /* Cabecera necesaria para indicar token JWT */
    let httpOptions = {
      headers: new HttpHeaders({ Authorization: `Bearer ${jwt}` }),
    };

    /* Devolver atleta activo */
    return this.http.get(endpoint, httpOptions);
  }


}
