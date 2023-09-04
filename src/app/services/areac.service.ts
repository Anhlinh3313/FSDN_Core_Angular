import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GeneralService } from './general.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { SelectModel } from '../models/select.model';
import { ResponseModel } from '../models';
import { Observable } from 'rxjs';

@Injectable()
export class AreaCService extends GeneralService {

  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "AreaC", messageService);
  }

  public getSelectModelAreacByPOHub(poHubId: any): Observable<ResponseModel> {
    let params = new HttpParams();
    params = params.append("poHubId", poHubId);
    return super.getCustomApi("GetByPOHub", params);
  }

  public async getSelectModelAreacByPOHubAsync(poHubId: any): Promise<SelectModel[]> {
    var res = await this.getSelectModelAreacByPOHub(poHubId).toPromise();
    if (res.isSuccess) {
      const data: SelectModel[] = [];
      data.push({ label: "-- Chọn khu vực --", value: null });
      if (res.data) {
        res.data.forEach(element => {
          data.push({ label: `${element.code} - ${element.name}`, value: element.id, data: element });
        });
        return data;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
