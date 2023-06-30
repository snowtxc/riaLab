import { IArea } from "./IArea"
import { ILlamadosEstadoPosibles } from "./ILlamadosEstadoPosibles"
import { IMiembroTribunal } from "./IMiembroTribunal"
import { IPersona } from "./IPersona"
import { IPostulante } from "./IPostulante"
import { ITipoIntegrante } from "./ITipoIntegrante"

export interface ILLamado{
    id: number,
    activo: true,
    identificador: string,
    nombre: string,
    linkPlanillaPuntajes: string,
    linkActa: string,
    minutosEntrevista:  number,
    areaId: number,
    area:  IArea,

    postulantes:IPostulante[],

    
    miembrosTribunal: 
      IMiembroTribunal [],



    llamadoEstados:{
        id: number,
        activo: boolean,
        fechaHora: Date,
        usuarioTransicion: string,
        observacion: string,
        llamadoId: number,
        llamadoEstadoPosibleId: number,
        llamadoEstadoPosible: ILlamadosEstadoPosibles
     } [],

    ultimoEstado: {
      id: number,
      activo : boolean,
      fechaHora: Date,
      usuarioTransicion: string,
      observacion: string,
      llamadoId: number,
      llamadoEstadoPosibleId: number,
      llamadoEstadoPosible: ILlamadosEstadoPosibles
      }
    }

      
  
  
