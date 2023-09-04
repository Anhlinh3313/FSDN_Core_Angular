import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from './general.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class TruckService extends GeneralService {

  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "Truck", messageService);
  }

}
