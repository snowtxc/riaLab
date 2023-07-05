import { IPersona } from "./IPersona";

export interface IPostulante{
    id: number,
    activo : boolean | null,
    fechaHoraEntrevista: string | null,
    estudioMeritosRealizado: boolean | null,
    entrevistaRealizada: boolean | null,
    llamadoId :number | null,
    personaId: number | null,
    persona: IPersona
}