export class CommonResponse<T>{
    ResponseCode?: string;
    ResponseMessage?: string;
    ResponseStatus?: string;
    ResponseData?: T;
}