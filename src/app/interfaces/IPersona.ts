import { ITipoDocumento } from "./ITipoDocumento";

export interface IPersona{
        id: number ,
        activo: boolean | null,
        tipoDeDocumento: ITipoDocumento,
        documento: string | null,
        primerNombre: string | null,
        segundoNombre: string | null,
        primerApellido: string | null,
        segundoApellido: string | null
}