import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private server = environment.apiServer
  private apiUrl = this.server + 'curso'

  constructor(private http : HttpClient) { }

  listar() {
      return this.http.get(this.apiUrl).toPromise()
  }

  excluir(id : string) {
      return this.http.request('DELETE', this.apiUrl, {body: {id: id}}).toPromise()
  }
}
