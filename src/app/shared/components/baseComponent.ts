import { ResponseModel } from "../../models/index";
import { Constant } from "../../infrastructure/constant";
import { MessageService } from "primeng/components/common/messageservice";
import { Message } from "primeng/primeng";
import { IBaseModel } from "../../models/abstract/ibaseModel.interface";
import { OnInit } from "@angular/core";
import { PermissionService } from "../../services";
import { Router } from "@angular/router";

export class BaseComponent {

  isAdd = true;
  isEdit = true;
  isDelete = true;

  constructor(protected messageService: MessageService,
    protected permissionService: PermissionService,
    protected router: Router) {
    this.permissionService.checkPermissionDetail(window.location.pathname, 1).subscribe(x => {
      if (x.isSuccess) {
        if (x.data["length"] > 0) {
          let data = x.data[0];
          if (!data.access) {
            this.router.navigate(["403"]);
          }
          else {
            this.isAdd = data.add;
            this.isEdit = data.edit;
            this.isDelete = data.delete;
          }
        }
      }
    });
  }

  isValidResponse(x: ResponseModel): boolean {
    if (!x.isSuccess) {
      if (x.message) {
        this.messageService.add({ severity: Constant.messageStatus.warn, detail: x.message });
      } else if (x.data) {
        let mess: Message[] = [];

        if (Array.isArray(x.data)) {
          x.data = x.data[0];
        }

        for (let key in x.data) {
          let element = x.data;
          if (key != 'key') {
            mess.push({ severity: Constant.messageStatus.warn, detail: element[key] });
          }
        }

        // result.forEach(element => {
        //   if (element.value) {
        //     mess.push({ severity: Constant.messageStatus.warn, detail: element.value });
        //   } else {
        //     mess.push({ severity: Constant.messageStatus.warn, detail: element.key });
        //   }
        // });

        this.messageService.addAll(mess);
      }
    }

    return x.isSuccess;
  }

  compareFn(c1: IBaseModel, c2: IBaseModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}