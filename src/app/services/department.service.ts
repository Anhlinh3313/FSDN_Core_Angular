import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Department } from '../models/department.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { SelectModel } from '../models/select.model';

@Injectable()
export class DepartmentService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "department", messageService);
  }

  async getSelectModelAsync(): Promise<SelectModel[]> {
    const res = await this.getAllAsync();
    const role: SelectModel[] = [];
    role.push({ label: "-- Chọn phòng ban --", value: null });
    if (res) {
      res.forEach(element => {
        role.push({ label: element.name, value: element, data: element });
      });
      return role;
    } else {
      return null;
    }
  }
}