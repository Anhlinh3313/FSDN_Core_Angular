import { Injectable, Inject } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Hub } from '../models/hub.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { HttpParams } from '@angular/common/http';
import { IBaseModel } from '../models/abstract/ibaseModel.interface';
import { ISuperBaseModel } from '../models/abstract/isuperBaseModel.interface';
import { Constant } from '../infrastructure/constant';
import { HandleError } from '../infrastructure/handleError';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class BaseService extends HandleError {
    constructor(protected httpClient: HttpClient, protected apiName: string, protected messageService: MessageService) {
        super(messageService);
    }

    public getCustomApi(apiMethod: string, params: HttpParams): Observable<ResponseModel> {
        return this.httpClient.get<ResponseModel>(`api/${this.apiName}/${apiMethod}`, { params: params });
    }

    public postCustomApi(apiMethod: string, model: Object): Observable<ResponseModel> {
        return this.httpClient.post<ResponseModel>(`api/${this.apiName}/${apiMethod}`, model);
    }

    public getCustomApiPaging(apiMethod: string, arrCols: string[] = [], params = new HttpParams(), pageSize: number = undefined, pageNumber: number = undefined): Observable<ResponseModel> {
        let cols = null;

        if (arrCols.length > 0) {
            cols = arrCols.join(',');
        }

        if (pageSize)
            params = params.append("pageSize", pageSize.toString());
        if (pageNumber)
            params = params.append("pageNumber", pageNumber.toString());
        if (cols)
            params = params.append("cols", cols);

        return this.httpClient.get<ResponseModel>(`api/${this.apiName}/${apiMethod}`, { params: params });
    }
}
