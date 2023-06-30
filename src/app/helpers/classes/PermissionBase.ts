import { PermissionType } from "../enums/permissions.enum";

export abstract class PermissionBase {
    public permissions: PermissionType[] = [];
    constructor() {}
}