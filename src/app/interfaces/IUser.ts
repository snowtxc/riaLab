export interface IUser{
    id: string;
    username: string,
    email: string,
    persona: {
        id: number,
        activo: boolean,
        tipoDeDocumento: {
            id: number,
            activo: boolean,
            nombre: string
        },
        documento: string,
        primerNombre: string,
        segundoNombre: string,
        primerApellido: string,
        segundoApellido: string
    },
    imagen: string,
    activo: boolean,
    roles: string[]
}
