import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ILLamado } from 'src/app/interfaces/ILlamado';
import { LlamadosService } from 'src/app/services/llamados.service';

@Component({
  selector: 'app-llamados',
  templateUrl: './llamados.component.html',
  styleUrls: ['./llamados.component.css']
})
export class LlamadosComponent implements OnInit{
    loading: boolean = true;


    displayedColumns: string[] = ['identificador', 'nombre', 'linkPlanillaPuntajes', 'linkActa', 'minutosEntrevista' ,  "actions"];
    dataSource: ILLamado[] = [];

    countTotal: number = 0;
    
    paginationObj = {
      limit: 10,
      offset: 0,
      id: 0,
      filters: {
        activo:  null,
        nombre: "",
        identificador: "",
        personaTribunalId : 0,
        estadoId: 0

      },
      orders: [
        
      ]
    }

    constructor(private _llamados:LlamadosService, private router:Router){
        
    }


    ngOnInit(): void {
        this.getLlamados();
    }

    getLlamados(){
      this.loading = true;
      this._llamados.list(this.paginationObj).subscribe((data:any) =>{

        const { list , totalCount} = data;
        this.dataSource = list;
        this.countTotal = totalCount;
        this.loading = false;
      })

    }

    onClickAdd(){
      alert("Hola!");
    }


    onViewLlamado(element: ILLamado){
        this.router.navigate(['/llamados',element.id,'editar']);
    }

    handlePageEvent(e: PageEvent) {
      this.countTotal = e.pageSize;
      this.paginationObj.offset = e.pageIndex;
  
      this.getLlamados();
    }
  

}
