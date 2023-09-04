import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { GeneralService } from './general.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ResponseModel } from '../models';
import { Observable } from 'rxjs';
import { SortUtil } from '../infrastructure/sort.util';
import { IBaseModel } from '../models/abstract/ibaseModel.interface';
import { RecycleBin } from '../models/recycle-bin.model';

@Injectable()
export class RecycleBinService extends GeneralService {
    constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
        super(httpClient, "RecycleBin", messageService);
    }
    public getRecycleBin(arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined,dateFrom: any, dateTo: any): Observable<ResponseModel> {
        let params = new HttpParams();

        if (!pageSize && !pageNumber && arrCols.length === 0) {
            if (dateFrom)
                params = params.append("dateFrom", dateFrom);
            if (dateTo)
                params = params.append("dateTo", dateTo);
            return this.httpClient.get<ResponseModel>(`api/${this.apiName}/GetRecycleBin`, { params: params });
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
            if (dateFrom)
                params = params.append("dateFrom", dateFrom);
            if (dateTo)
                params = params.append("dateTo", dateTo);

            return this.httpClient.get<ResponseModel>(`api/${this.apiName}/GetRecycleBin`, { params: params });
        }
    }
    public async getRecycleBinAsync(arrCols: string[] = [], pageSize: number = undefined, pageNumber: number = undefined,dateFrom: any, dateTo: any): Promise<any> {
        const res = await this.getRecycleBin(arrCols, pageSize, pageNumber,dateFrom,dateTo).toPromise();
        if (res.isSuccess) {
            let data = res.data as any;
            data = SortUtil.sortAlphanumerical(data, "name");
            return data;
        }
        return null;
    }
    public restoreTable(id: any): Observable<ResponseModel> {
        let obj = new Object();
        obj["restoreId"] = id;
        return super.postCustomApi("RestoreTable", obj);
    }
    public checkDeleteTable(data: RecycleBin): Observable<ResponseModel> {
        let obj = new Object();
        obj["tableName"] = data.tableName;
        obj["id"] = data.idDeleted;
        return super.postCustomApi("CheckDeleteTable", obj);
    }
    public emptyRecycleBin(id: any): Observable<ResponseModel> {
        let obj = new Object();
        obj["emptyId"] = id;
        return super.postCustomApi("EmptyRecycleBin", obj);
    }
}