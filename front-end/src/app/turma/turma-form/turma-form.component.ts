import { CursoService } from './../../curso/curso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TurmaService } from './../turma.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {​​​​ Location }​​​​ from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProfessorService } from 'src/app/professor/professor.service';
import { SalaAulaService } from 'src/app/sala-aula/sala-aula.service';

@Component({
  selector: 'app-turma-form',
  templateUrl: './turma-form.component.html',
  styleUrls: ['./turma-form.component.scss']
})
export class TurmaFormComponent implements OnInit {

  title : string = 'Nova turma'

  turma : any = {} // Objeto vazio, nome da entidade no SINGULAR

  diasSemana : any = [
      { val: 'dom', descr: 'Domingo' },
      { val: 'seg', descr: 'Segunda-feira' },
      { val: 'ter', descr: 'Terça-feira' },
      { val: 'qua', descr: 'Quarta-feira' },
      { val: 'qui', descr: 'Quinta-feira' },
      { val: 'sex', descr: 'Sexta-feira' },
      { val: 'sab', descr: 'Sábado' }
  ]

  // Variáveis para armazenar as listagens das entidades relacionadass=
  cursos : any = []  // Nome no plural, vetor vazio
  professores : any = []
  salasAula : any = []

  constructor(
      private turmaSrv : TurmaService,
      private cursoSrv : CursoService,
      private professorSrv : ProfessorService,
      private salaAulaSrv : SalaAulaService, 
      private snackBar : MatSnackBar,
      private location : Location,
      private actRoute : ActivatedRoute
  ) { }

  async ngOnInit(){
        // Verificando se existe id na rota que trouxe ao formulário
        if(this.actRoute.snapshot.params['id']) {
            try{
              // 1) Trazer o registro do back-end para edição
              this.turma = await this.turmaSrv.obterUm(this.actRoute.snapshot.params['id'])
              // 2) Mudar o título da página
              this.title = 'Editando turma'
            }
            catch(erro) {
              console.log(erro)
              this.snackBar.open('ERRO: não foi possível carregar os dados para edição.',
              'Que pena!', { duration: 5000 })
            }
        }

        // Carregar as listagens das entidades relacionadas
        try {
          this.cursos = await this.cursoSrv.listar()
          this.professores = await this.professorSrv.listar()
          this.salasAula = await this.salaAulaSrv.listar()
        }
        catch (erro){
          console.log(erro)
          this.snackBar.open('ERRO: não foi possível carregar todos os dados do formulário.',
          'Que pena!', { duration: 5000 })
        }
    }

  async salvar(form : NgForm) {
    try {
        if(form.valid) {
            // 1) Enviar os dados para o back-end para serem salvos
            if(this.turma._id) {
                // _id existe, esse registro já foi salvo anteriormente
                // no BD e é caso de atualização
                await this.turmaSrv.atualizar(this.turma)
            }
            else {
                await this.turmaSrv.novo(this.turma)
            }
                
            // 2) Dar um feedback (mensagem) para o usuário
            this.snackBar.open('Dados salvos com sucesso. ', 'Entendi',
              { duration: 5000 })
            // 3) Voltar para a tela de listagem
            this.location.back()
        }    
    }
    catch(erro) {
        console.log(erro)
        this.snackBar.open('ERRO: não foi possível salvar os dados.', 'Que pena!',
        { duration: 5000 })
    }

  }

  voltar(form : NgForm) {
    let result = true
    // form.dirty = formulário "sujo", não salvo (via código)
    // form.touched = o conteúdo de algum campo foi alterado (via usuário)
    if(form.dirty && form.touched) {
      result = confirm('Há dados não salvos. Deseja realmente voltar?')
    }
    // Retorna à página anterior se resposta foi positiva ou se o formulário
    // estiver "limpo"
    if(result) this.location.back()
  }
}
