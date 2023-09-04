import { MessageService } from "primeng/components/common/messageservice";
import { ResponseModel } from "../models";
import { Constant } from "./constant";
import { Message } from "primeng/primeng";

export class HandleError {
  constructor(protected messageService: MessageService) { }

  isValidResponse(x: ResponseModel): boolean {
    if (!x.isSuccess) {
      if (x.message) {
        this.messageService.add({ severity: Constant.messageStatus.warn, detail: x.message });
      } else if (x.data) {
        let mess: Message[] = [];

        for (let key in x.data) {
          let element = x.data[key];
          mess.push({ severity: Constant.messageStatus.warn, detail: element });
        }

        this.messageService.addAll(mess);
      }
      else {
        this.messageService.add({ severity: Constant.messageStatus.error, detail: "Đã có lỗi xảy ra! Vui lòng thử lại!" });
        console.log(x.exception);
      }
    }

    return x.isSuccess;
  }
}
