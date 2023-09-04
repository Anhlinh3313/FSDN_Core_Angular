import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/components/common/messageservice';
import { TruckModel } from '../models/truck.model';
import { SelectItem } from 'primeng/primeng';
import { SortUtil } from '../infrastructure/sort.util';

@Injectable()
export class TruckRentalService  extends GeneralService {

  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "TruckRental", messageService);
  }

  async getSelectItemAsync(): Promise<SelectItem[]> {
    const res = await this.getAllAsync();
    if (res) {
      let allTruckRental: SelectItem[] = [];
      res.forEach(element => {
        allTruckRental.push({
          label: element.name,
          value: element.id
        });
      });
      allTruckRental.unshift({ label: `-- Chọn đơn vị thuê --`, value: null });
      return allTruckRental;
    }
    return null;
  }
}
