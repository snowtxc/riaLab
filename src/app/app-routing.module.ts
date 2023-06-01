import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';


import { MainComponent } from './pages/main/main.component';
import { TiposDocumentosComponent } from './pages/tipos-documentos/tipos-documentos.component';
import { LlamadosEstadosPosiblesComponent } from './pages/llamados-estados-posibles/llamados-estados-posibles.component';
import { AreasComponent } from './pages/areas/areas.component';
import { TiposIntegrantesComponent } from './pages/tipos-integrantes/tipos-integrantes.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '', component: MainComponent, children: [
    {path: '', redirectTo: 'tipos-documentos', pathMatch: 'full'},
    {path: 'tipos-documentos',  component: TiposDocumentosComponent},
    {path: 'tipos-integrantes',  component: TiposIntegrantesComponent},
    {path: 'areas',  component: AreasComponent},
    {path: 'llamados-estados-posibles',  component: LlamadosEstadosPosiblesComponent},

  ],  canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  
];

@NgModule({  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
