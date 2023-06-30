import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionType } from '../enums/permissions.enum';
import { PermissionsManagerService } from 'src/app/services/permissions.service';
import { Role } from '../enums/roles.enum';

@Directive({
  selector: '[appIsGranted]'
})
export class IsGrantedDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionManagerS: PermissionsManagerService
  ) { }

  @Input() set appIsGranted(usersRolesEnabled: Role[]) {
    this.isGranted(usersRolesEnabled);
  }

  private isGranted(usersRolesEnabled: Role[]) {
    if (this.permissionManagerS.isGranted(usersRolesEnabled)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }


}
