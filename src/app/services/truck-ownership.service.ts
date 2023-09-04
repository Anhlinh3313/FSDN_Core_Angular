import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/components/common/messageservice';
import { TruckModel } from '../models/truck.model';
import { SelectItem } from 'primeng/primeng';
import { SortUtil } from '../infrastructure/sort.util';

@Injectable()
export class TruckOwnershipService extends GeneralService {

  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "TruckOwnership", messageService);
  }

  async getSelectItemAsync(): Promise<SelectItem[]> {
    const res = await this.getAllAsync();
    if (res) {
      let allTruckOwnership: SelectItem[] = [];
      res.forEach(element => {
        allTruckOwnership.push({
          label: element.name,
          value: element.id
        });
      });
      allTruckOwnership.unshift({ label: `-- Chọn loại xe --`, value: null });
      return allTruckOwnership;
    }
    return null;
  }
}
