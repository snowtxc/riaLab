export interface IUserDTO{
    id:string,
    tipoDocumentoId:  number,
    documento: string,
    primerNombre: string,
    segundoNombre: string,
    primerApellido: string,
    segundoApellido: string,
    email: string,
    imagen: string,
    activo: boolean
}