import { ILlamadosEstadoPosibles } from "./ILlamadosEstadoPosibles";

export interface ILLamadoEstado{
        id: number,
        activo: boolean,
        fechaHora: Date,
        usuarioTransicion: string,
        observacion: string,
        llamadoId: number,
        llamadoEstadoPosibleId: number,
        llamadoEstadoPosible: ILlamadosEstadoPosibles   
}