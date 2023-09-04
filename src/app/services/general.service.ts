import { Injectable, Inject } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Hub } from '../models/hub.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { HttpParams } from '@angular/common/http';
import { IBaseModel } from '../models/abstract/ibaseModel.interface';
import { ISuperBaseModel } from '../models/abstract/isuperBaseModel.interface';
import { BaseService } from './base.service';
import { SortUtil } from '../infrastructure/sort.util';
import { SelectModel } from '../models/select.model';

@Injectable()
export class GeneralService extends BaseService {
    public get(id: any): Observable<ResponseModel> {
        return this.httpClient.get<ResponseModel>(`api/${this.apiName}/get?id=${id}`);
    }

    public async getAsync(id: any): Promise<any> {
        const res = await this.get(id).toPromise();
        if (res.isSuccess) {
            const data = res.data as any;
            return data;
        }
        return null;
    }

    public getAll(arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined): Observable<ResponseModel> {
        let params = new HttpParams();

        if (!pageSize && !pageNumber && arrCols.length === 0) {
            return this.httpClient.get<ResponseModel>(`api/${this.apiName}/getAll`);
        }
        else {
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

            return this.httpClient.get<ResponseModel>(`api/${this.apiName}/getAll`, { params: params });
        }
    }

    public async getAllAsync(arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined): Promise<any> {
        const res = await this.getAll(arrCols, pageSize, pageNumber).toPromise();
        if (res.isSuccess) {
            let data = res.data as any;
            data = SortUtil.sortAlphanumerical(data, "name");
            return data;
        }
        return null;
    }

    public create(model: IBaseModel): Observable<ResponseModel> {
        return this.httpClient.post<ResponseModel>(`api/${this.apiName}/create`, model);
    }

    public async createAsync(data: any): Promise<any> {
        const res = await this.create(data).toPromise();
        if (res.isSuccess) {
            const data = res.data as any;
            return data;
        }
        return null;
    }

    public update(model: IBaseModel): Observable<ResponseModel> {
        return this.httpClient.post<ResponseModel>(`api/${this.apiName}/update`, model);
    }

    public async updateAsync(data: any): Promise<any> {
        const res = await this.update(data).toPromise();
        if (res.isSuccess) {
            const data = res.data as any;
            return data;
        }
        return null;
    }

    public delete(model: BaseModel): Observable<ResponseModel> {
        return this.httpClient.post<ResponseModel>(`api/${this.apiName}/delete`, model);
    }

    public async deleteAsync(data: any): Promise<any> {
        const res = await this.delete(data).toPromise();
        if (res.isSuccess) {
            const data = res.data as any;
            return data;
        }
        return null;
    }

    async getAllSelectModelAsync(): Promise<SelectModel[]> {
        const res = await this.getAll().toPromise();
        if (res.isSuccess) {
            const selectModel = [];
            const datas = res.data as any[];

            selectModel.push({ label: "-- Chọn dữ liệu --", data: null, value: null });
            datas.forEach(element => {
                selectModel.push({
                    label: `${element.code} - ${element.name}`,
                    data: element,
                    value: element.id
                });
            });
            return selectModel;
        }
    }
}
