import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';


import { MainComponent } from './pages/main/main.component';
import { TiposDocumentosComponent } from './pages/tipos-documentos/tipos-documentos.component';
import { LlamadosEstadosPosibles } from './pages/llamados-estados-posibles/llamados-estados-posibles.component';
import { AreasComponent } from './pages/areas/areas.component';
import { TiposIntegrantesComponent } from './pages/tipos-integrantes/tipos-integrantes.component';
import { AuthGuard } from './guards/auth.guard';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { RoleGuard } from './guards/role-guard.guard';
import { Role } from './helpers/enums/roles.enum';
import { NotFoundComponent } from './pages/not-found-component/not-found-component.component';
const routes: Routes = [
  {path: '', component: MainComponent, children: [
    {path: '', redirectTo: 'tipos-documentos', pathMatch: 'full'},
    {path: 'tipos-documentos',  component: TiposDocumentosComponent},
    {path: 'tipos-integrantes',  component: TiposIntegrantesComponent},
    {path: 'areas',  component: AreasComponent},
    {path: 'llamados-estados-posibles',  component: LlamadosEstadosPosibles},
    {path: 'usuarios',  component: UsuariosComponent, canActivate: [RoleGuard],
      data: {
        roles: [Role.ADMIN]
      }},

  ],  canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'forgot-password',  component: ForgotPasswordComponent},
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
  { path: '404', component: NotFoundComponent }, 



  
];

@NgModule({  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
