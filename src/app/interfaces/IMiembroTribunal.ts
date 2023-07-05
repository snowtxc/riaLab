import { IPersona } from "./IPersona";
import { ITipoIntegrante } from "./ITipoIntegrante";

export interface IMiembroTribunal{
        id: number,
        activo: boolean,
        orden: number,
        renuncia: boolean,
        motivoRenuncia: string,
        llamadoId: number,
        personaId: number,
        persona: IPersona,
        tipoDeIntegranteId: number,
        tipoDeIntegrante: ITipoIntegrante
    
}