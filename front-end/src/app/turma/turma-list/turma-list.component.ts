import { MatSnackBar } from '@angular/material/snack-bar';
import { TurmaService } from './../turma.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-turma-list',
  templateUrl: './turma-list.component.html',
  styleUrls: ['./turma-list.component.scss']
})
export class TurmaListComponent implements OnInit {

  turmas : any = [];  // Vetor vazio  

  displayedColumns : string[] = ['nome', 'curso', 'professor', 'periodo',  'dias_semana', 'horario', 'sala_aula', 'editar', 'excluir']

    constructor(
      private turmaSrv : TurmaService,
      private snackBar : MatSnackBar
    ) { }

    async ngOnInit() {
      this.turmas = await this.turmaSrv.listar()
      console.log(this.turmas)
    }

    async excluir(id : string) {
      if(confirm('Deseja realmente excluir este item?')) {
          try {
            // 1) Efetuar a exclusão
            await this.turmaSrv.excluir(id)
            // 2) Atualizar os dados da tabela
            this.ngOnInit()
            // 3) Dar um feedback para o usuário
            this.snackBar.open('Item excluído com sucesso.', 'Entendi', {
                duration: 5000 // 5 segundos
            })
          }
          catch(erro){
            // 4) Dar um feedback de erro para o usuário
            console.log(erro)
            this.snackBar.open('ERRO: não foi possível excluir este item.', 'Que pena!', {
                duration: 5000 // 5 segundos
            })
          }
        }
    }
}
