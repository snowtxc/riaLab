import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {HTTP_INTERCEPTORS } from '@angular/common/http';


import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
import { LoginComponent } from './pages/login/login.component'; 
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { MainComponent } from './pages/main/main.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSelectModule} from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TiposDocumentosComponent } from './pages/tipos-documentos/tipos-documentos.component';
import { AreasComponent } from './pages/areas/areas.component';
import { TiposIntegrantesComponent } from './pages/tipos-integrantes/tipos-integrantes.component';
import { LlamadosEstadosPosibles } from './pages/llamados-estados-posibles/llamados-estados-posibles.component';
import { MatTableModule } from "@angular/material/table";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ActiveTextPipe } from './helpers/pipes/active-text.pipe';
import { TipoDocumentoModalComponent } from './components/tipo-documento-modal/tipo-documento-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { AreaModalComponent } from './components/area-modal/area-modal.component';
import { TipoIntegranteModalComponent } from './components/tipo-integrante-modal/tipo-integrante-modal.component';
import { LlamadoEstadoPosibleModalComponent } from './components/llamado-estado-posible-modal/llamado-estado-posible-modal.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { MatPaginatorModule} from '@angular/material/paginator';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { ImageAvatarComponent } from './components/image-avatar/image-avatar.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { UserRolesComponent } from './components/user-roles/user-roles.component';
import { IsGrantedDirective } from './helpers/directive/is-granted.directive';
import { NotFoundComponent } from './pages/not-found-component/not-found-component.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RestorePasswordComponent } from './pages/restore-password/restore-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    TiposDocumentosComponent,
    AreasComponent,
    TiposIntegrantesComponent,
    LlamadosEstadosPosibles,
    ActiveTextPipe,
    TipoDocumentoModalComponent,
    ConfirmModalComponent,
    AreaModalComponent,
    TipoIntegranteModalComponent,
    LlamadoEstadoPosibleModalComponent,
    UsuariosComponent, 
    UserModalComponent,
    ForgotPasswordComponent,
    ImageAvatarComponent,
    UserRolesComponent,
    IsGrantedDirective,
    NotFoundComponent,
    RestorePasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    HttpClientModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatPaginatorModule,
    FlexLayoutModule,
    MatGridListModule,
    MatCheckboxModule,
    MatProgressBarModule

  
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
   }],
  bootstrap: [AppComponent]
})
export class AppModule { }
