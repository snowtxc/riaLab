export interface IResponseList{
    list: any[],
    totalCount: number,
    totalPages: number,
    currentPage: number,
    offset: number,
    limit : number
}