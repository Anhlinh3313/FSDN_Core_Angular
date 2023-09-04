import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/components/common/messageservice';
import { TruckModel } from '../models/truck.model';
import { SelectItem } from 'primeng/primeng';
import { SortUtil } from '../infrastructure/sort.util';

@Injectable()
export class TruckTypeService extends GeneralService{

  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "TruckType", messageService);
  }

  async getSelectItemAsync(): Promise<SelectItem[]> {
    const res = await this.getAllAsync();
    if (res) {
      let allTruckType: SelectItem[] = [];
      res.forEach(element => {
        allTruckType.push({
          label: element.name,
          value: element.id
        });
      });
      allTruckType.unshift({ label: `-- Chọn kiểu xe --`, value: null });
      return allTruckType;
    }
    return null;
  }
}
