import { Component, OnInit, TemplateRef } from '@angular/core';
import { Constant } from '../../infrastructure/constant';
import { RecycleBinService } from '../../services/recycle-bin.service';
import { RecycleBin } from '../../models/recycle-bin.model';
import { Table } from 'primeng/table';
import { BaseComponent } from '../../shared/components/baseComponent';
import { MessageService } from 'primeng/components/common/messageservice';
import { PermissionService } from '../../services';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BaseModel } from '../../models';
import { DateRangeFromTo } from '../../view-model/dateRangeFromTo.viewModel';
import { ShipmentFilterViewModel } from '../../models/shipmentFilterViewModel';
import { SearchDate } from '../../infrastructure/searchDate.helper';
import * as moment from "moment";
import { environment } from '../../../environments/environment';
import { DaterangepickerConfig } from "ng2-daterangepicker";

declare var jQuery: any;

@Component({
  selector: 'app-permission',
  templateUrl: 'recycle-bin.component.html',
  styles: [`
  agm-map {
    height: 700px;
  }
  `]
})
export class RecycleBinComponent extends BaseComponent implements OnInit {
  parentPage: string = Constant.pages.recycleBin.name;
  constructor(
    public recycleBinService: RecycleBinService,
    private modalService: BsModalService,
    protected messageService: MessageService,
    public permissionService: PermissionService, public router: Router,
    protected daterangepickerOptions: DaterangepickerConfig,
  ) {
    super(messageService, permissionService, router);

    this.daterangepickerOptions.settings = {
      locale: { format: environment.formatDate },
      alwaysShowCalendars: false,
      ranges: {
        "Hôm nay": [moment().subtract(0, "day"), moment()],
        "1 tuần": [moment().subtract(7, "day"), moment()],
        "1 tháng trước": [moment().subtract(1, "month"), moment()],
        "3 tháng trước": [moment().subtract(4, "month"), moment()],
        "6 tháng trước": [moment().subtract(6, "month"), moment()],
        "12 tháng trước": [moment().subtract(12, "month"), moment()],
        "2 năm trước": [moment().subtract(24, "month"), moment()]
      }
    };
    const currentDate = moment(new Date()).format("YYYY/MM/DD");
    let orderDateFrom = currentDate;
    let orderDateTo = currentDate;

    this.shipmentFilterViewModel.OrderDateFrom = orderDateFrom;
    this.shipmentFilterViewModel.OrderDateTo = orderDateTo;
    this.shipmentFilterViewModel.PageNumber = this.pageNum;
    this.shipmentFilterViewModel.PageSize = this.rowPerPage;
    this.shipmentFilterViewModel.Cols = [];
  }

  colsTable = [
    { field: 'tableName', header: 'Tên bảng' },
    { field: 'createdWhen', header: 'Thời gian xóa' },
    { field: 'createdByFullName', header: 'Họ tên người xóa' },
    { field: 'createdByUsername', header: 'Tên tài khoản xóa' },
    { field: 'createdByCode', header: 'Mã tài khoản xóa' },
    { field: 'name', header: 'Tên tài liệu' },
    { field: 'code', header: 'Mã tài liệu' },
  ]
  datas: RecycleBin[];
  listDatas: RecycleBin[];
  totalRecords: number;
  data: RecycleBin;
  //
  modalTitle: string;
  bsModalRef: BsModalRef;
  list: RecycleBin[];
  //
  selectedData: RecycleBin[];
  requestGetPickupHistory: DateRangeFromTo = new DateRangeFromTo();
  shipmentFilterViewModel: ShipmentFilterViewModel = new ShipmentFilterViewModel();
  //
  pageNum = null;
  rowPerPage: number = null;
  //
  txtNoteCancel: string;
  //
  ngOnInit() {
    this.initData()
  }

  async initData() {
    const recycleBin = await this.recycleBinService.getRecycleBinAsync(this.shipmentFilterViewModel.Cols, this.shipmentFilterViewModel.PageSize, this.shipmentFilterViewModel.PageNumber, this.shipmentFilterViewModel.OrderDateFrom, this.shipmentFilterViewModel.OrderDateTo);
    if (recycleBin) {
      this.datas = recycleBin as RecycleBin[];
      this.totalRecords = this.datas.length;
      this.listDatas = this.datas;
    }
  }

  restore(id: any) {
    let list = [...this.listDatas];
    this.recycleBinService.restoreTable(id).subscribe(x => {
      if (!super.isValidResponse(x)) return;
      this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Cập nhật thành công' });
      this.listDatas = list;
      this.data = null;
      this.initData();
    });
  }

  mapSaveData(obj: RecycleBin) {
    if (obj) {
      this.data.id = obj.id;
      this.data.concurrencyStamp = obj.concurrencyStamp;
    }
  }

  saveClient(list: RecycleBin[]) {
    this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Cập nhật thành công' });
    this.listDatas = list;
    this.data = null;
  }

  refresh(table: Table) {
    table.reset();
    this.initData();
  }
  emptyRecycleBin(data: RecycleBin, templateDelete: TemplateRef<any>) {
    this.recycleBinService.checkDeleteTable(data).subscribe(x => {
      if (!super.isValidResponse(x)) return;
      this.list = x.data as RecycleBin[];
      if (this.list.length > 0) {
        this.modalTitle = "Dữ liệu đang được sử dụng:";
        this.bsModalRef = this.modalService.show(templateDelete, { class: 'inmodal animated bounceInRight modal-s' });
        this.data = this.clone(data);
      }
      else {
        this.bsModalRef = this.modalService.show(templateDelete, { class: 'inmodal animated bounceInRight modal-s' });
        this.data = this.clone(data);
      }
    });
  }
  delete() {
    this.recycleBinService.emptyRecycleBin(this.data.id).subscribe(x => {
      this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Xóa thành công!' });
      this.initData();
    });
    this.bsModalRef.hide();
  }
  clone(model: RecycleBin): RecycleBin {
    let data = new RecycleBin();
    for (let prop in model) {
      data[prop] = model[prop];
    }
    return data;
  }
  // dateRangePicker
  public mainInput = {
    start: moment().subtract(0, "day"),
    end: moment()
  };

  public eventLog = "";

  public selectedDate(value: any, dateInput: any) {
    this.selectedData = [];
    dateInput.start = value.start;
    dateInput.end = value.end;

    //
    this.requestGetPickupHistory.fromDate = moment(value.start).toDate();
    this.requestGetPickupHistory.toDate = moment(value.end).toDate();

    this.shipmentFilterViewModel.OrderDateFrom = SearchDate.formatToISODate(moment(value.start).toDate());
    this.shipmentFilterViewModel.OrderDateTo = SearchDate.formatToISODate(moment(value.end).toDate());

    // this.selectedDateFrom = this.requestGetPickupHistory.fromDate;
    // this.selectedDateTo = this.requestGetPickupHistory.toDate;
    // this.loadLazy(this.event);
    const fromDate = this.requestGetPickupHistory.fromDate.toISOString();
    const toDate = this.requestGetPickupHistory.toDate.toISOString();
    // this.loadShipment(fromDate, toDate);
    this.initData()
  }
  public calendarEventsHandler(e: any) {
    this.eventLog += "\nEvent Fired: " + e.event.type;
  }
}
