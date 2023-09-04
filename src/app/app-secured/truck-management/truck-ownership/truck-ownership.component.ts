import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TruckOwnershipService } from '../../../services/truck-ownership.service';
import { LazyLoadEvent } from 'primeng/primeng';
import { FilterUtil } from '../../../infrastructure/filter.util';
import { KeyCodeUtil } from '../../../infrastructure/keyCode.util';
import { Constant } from '../../../infrastructure/constant';
import { TruckModel } from '../../../models/truck.model';
import { MessageService } from 'primeng/components/common/messageservice';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { PermissionService } from '../../../services';
import { Router } from '@angular/router';
import { BaseModel } from '../../../models';
import { StringHelper } from '../../../infrastructure/string.helper';
import { SortUtil } from '../../../infrastructure/sort.util';
import { InputValue } from '../../../infrastructure/inputValue.helper';

@Component({
  selector: 'app-truck-ownership',
  templateUrl: './truck-ownership.component.html',
  styles: []
})
export class TruckOwnershipComponent extends BaseComponent implements OnInit {
  txtFilterGb: string;

  //
  parentPage: string = Constant.pages.truckManagementModule.name;
  currentPage: string = Constant.pages.truckManagementModule.childrens.truckOwnership.name;
  //

  //
  datasource: any[];
  listData: any[];
  filterRows: any[];
  totalRecords: number = 0;
  rowPerPage = 20;
  //

  //
  columns: string[] = [
    "code",
    "name",
    "createdWhen",
  ];
  //

  //
  dataUpdate: TruckModel = new TruckModel();
  modalTitle: string;
  bsModalRef: BsModalRef;
  dataDelete: TruckModel;
  //

  constructor(private modalService: BsModalService,
    private truckOwnershipService: TruckOwnershipService,
    public messageService: MessageService,
    public permissionService: PermissionService,
    public router: Router) {
    super(messageService, permissionService, router);
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    const data = await this.truckOwnershipService.getAllAsync();
    if (data) {
      this.datasource = data;
      this.listData = this.datasource.slice(0, this.rowPerPage);
    }
  }

  loadLazy(event: LazyLoadEvent) {
    setTimeout(() => {
      this.filterRows = [];

      if (this.datasource) {

        if (event.filters.length > 0)
          this.filterRows = this.datasource.filter(x =>
            FilterUtil.filterField(x, event.filters)
          );
        else
          this.filterRows = this.datasource.filter(x =>
            FilterUtil.gbFilterFiled(x, event.globalFilter, this.columns)
          );

        this.filterRows.sort(
          (a, b) =>
            FilterUtil.compareField(a, b, event.sortField) * event.sortOrder
        );

        this.listData = this.filterRows.slice(event.first, event.first + event.rows);
        this.totalRecords = this.filterRows.length;
      }
    }, 0);
  }

  // Update model
  openModel(template: TemplateRef<any>, data: TruckModel) {
    if (!data) {
      this.modalTitle = "Tạo mới";
      this.dataUpdate = new TruckModel();
    }
    else {
      this.modalTitle = "Cập nhật";
      this.dataUpdate = Object.assign({}, data);
    }

    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }

  async save() {
    this.messageService.clear();
    if (StringHelper.isNullOrEmpty(this.dataUpdate.code)) {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Vui lòng nhập mã"
      });
      return;
    }
    this.dataUpdate.code = InputValue.trimInput(this.dataUpdate.code);

    if (StringHelper.isNullOrEmpty(this.dataUpdate.name)) {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Vui lòng nhập tên"
      });
      return;
    }
    this.dataUpdate.name = InputValue.trimInput(this.dataUpdate.name);

    if (this.dataUpdate.id) {
      const res = await this.truckOwnershipService.updateAsync(this.dataUpdate);
      if (res) {
        this.messageService.add({
          severity: Constant.messageStatus.success,
          detail: "Đã cập nhật thành công"
        });
        this.refresh();
        this.bsModalRef.hide();
      }
    }
    else {
      const res = await this.truckOwnershipService.createAsync(this.dataUpdate);
      if (res) {
        this.messageService.add({
          severity: Constant.messageStatus.success,
          detail: "Tạo mới thành công"
        });
        this.refresh();
        this.bsModalRef.hide();
      }
    }
  }
  //

  // Delete model
  openDeleteModel(template: TemplateRef<any>, data: TruckModel) {
    this.modalTitle = "Hủy loại xe";
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
    this.dataDelete = data;
  }

  async delete() {
    let obj = new BaseModel(this.dataDelete.id);
    const data = await this.truckOwnershipService.deleteAsync(obj);
    if (data) {
      this.messageService.add({
        severity: Constant.messageStatus.success,
        detail: "Đã hủy thành công"
      });
      this.refresh();
      this.bsModalRef.hide();
    }
  }

  refresh() {
    this.txtFilterGb = null;
    this.getData();
  }
  //

  keyDownFunction(event) {
    if ((event.ctrlKey || event.metaKey) && event.which === KeyCodeUtil.charS) {
      // this.save();
      event.preventDefault();
      return false;
    }
  }

}
