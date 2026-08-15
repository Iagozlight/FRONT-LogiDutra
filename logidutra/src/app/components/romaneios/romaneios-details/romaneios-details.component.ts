import { Component, inject } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { ItemEntrega } from '../../../models/item-entrega';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-romaneios-details',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './romaneios-details.component.html',
  styleUrl: './romaneios-details.component.scss'
})
export class RomaneiosDetailsComponent {

  titulo = 'cadastrar nova entrega'

  entrega = new ItemEntrega(0, '', '', '');

  route = inject(ActivatedRoute);
  router = inject(Router);

  constructor(){
    let id = this.route.snapshot.params['id']
    if (id > 0){
      this.titulo = 'Editar entrega'
      this.findById(id);
    }
  }

  findById(id: number){
    let entregaRetornada: ItemEntrega = new ItemEntrega(id, 'Joao silva', 'Roupeiro, sofa, comoda', 'Rua das flores, 123')
    this.entrega = entregaRetornada;
  }

  salvar(){
    if(this.entrega.id > 0){
      Swal.fire({
        title: 'Editado',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
      this.router.navigate(['/romaneios'], {state: {entregaEditada: this.entrega}})
    } else {
      Swal.fire({
        title: 'Salvo com sucesso',
        icon: 'success',
        confirmButtonText: 'Ok'
      })
    }
  }

}
