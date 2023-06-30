import { IArea } from "./IArea";

export interface IResponsabilidades{
    id: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    area: IArea
    areaId: string
}
