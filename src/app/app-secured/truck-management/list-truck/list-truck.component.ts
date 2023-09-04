import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TruckService } from '../../../services/truck.service';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';
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
import { TruckTypeService } from '../../../services/truck-type.service';
import { TruckOwnershipService } from '../../../services/truck-ownership.service';
import { TruckRentalService } from '../../../services/truck-rental.service';
import { TruckOwnershipHelper } from '../../../infrastructure/truckOwnership.helper';

@Component({
  selector: 'app-list-truck',
  templateUrl: './list-truck.component.html',
  styles: []
})
export class ListTruckComponent extends BaseComponent implements OnInit {
  truckRentaled: number = TruckOwnershipHelper.XE_THUE;
  truckRentals: SelectItem[];
  selectedTruckRental: number;
  truckOwnerships: SelectItem[];
  selectedTruckOwnership: number;
  truckTypes: SelectItem[];
  selectedTruckType: number;
  txtFilterGb: string;

  //
  parentPage: string = Constant.pages.truckManagementModule.name;
  currentPage: string = Constant.pages.truckManagementModule.childrens.listTruck.name;
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
    private truckService: TruckService,
    private truckTypeService: TruckTypeService,
    private truckOwnershipService: TruckOwnershipService,
    private truckRentalService: TruckRentalService,
    public messageService: MessageService,
    public permissionService: PermissionService,
    public router: Router) {
    super(messageService, permissionService, router);
  }

  ngOnInit() {
    this.getData();
    this.loadTruckType();
    this.loadTruckOwnership();
    this.loadTruckRental();
  }

  async getData() {
    const data = await this.truckService.getAllAsync();
    if (data) {
      this.datasource = data;
      this.listData = this.datasource.slice(0, this.rowPerPage);
    }
  }

  async loadTruckType() {
    this.truckTypes = null;
    this.selectedTruckType = null;
    const data = await this.truckTypeService.getSelectItemAsync();
    if (data) {
      this.truckTypes = data;
    }
  }

  async loadTruckOwnership() {
    this.truckOwnerships = null;
    this.selectedTruckOwnership = null;
    const data = await this.truckOwnershipService.getSelectItemAsync();
    if (data) {
      this.truckOwnerships = data;
    }
  }

  async loadTruckRental() {
    this.truckRentals = null;
    this.selectedTruckRental = null;
    const data = await this.truckRentalService.getSelectItemAsync();
    if (data) {
      this.truckRentals = data;
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
      this.selectedTruckType = null;
      this.selectedTruckOwnership = null;
      this.selectedTruckRental = null;
    }
    else {
      this.modalTitle = "Cập nhật";
      this.dataUpdate = Object.assign({}, data);
      this.selectedTruckType = this.dataUpdate.truckTypeId;
      this.selectedTruckOwnership = this.dataUpdate.truckOwnershipId;
      this.selectedTruckRental = this.dataUpdate.truckRentalId;
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

    if (StringHelper.isNullOrEmpty(this.dataUpdate.truckNumber)) {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Vui lòng nhập biển số"
      });
      return;
    }
    this.dataUpdate.truckNumber = InputValue.trimInput(this.dataUpdate.truckNumber);

    if (!(this.dataUpdate.payLoad > 0)) {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Vui lòng nhập trọng tải hiện tại"
      });
      return;
    }

    if (!(this.dataUpdate.loadLimit > 0)) {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Vui lòng nhập trọng tải tối đa"
      });
      return;
    }

    if (this.dataUpdate.payLoad > this.dataUpdate.loadLimit) {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Trọng tải hiện tại không được lớn hơn trọng tải tối đa"
      });
      return;
    }

    if (!this.selectedTruckType) {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Vui lòng chọn kiểu xe"
      });
      return;
    }
    this.dataUpdate.truckTypeId = this.selectedTruckType;
    this.dataUpdate.truckTypeName = this.truckTypes.find(x => x.value === this.selectedTruckType).label;

    if (!this.selectedTruckOwnership) {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Vui lòng chọn loại xe"
      });
      return;
    }
    this.dataUpdate.truckOwnershipId = this.selectedTruckOwnership;
    this.dataUpdate.truckOwnershipName= this.truckOwnerships.find(x => x.value === this.selectedTruckOwnership).label;

    if (this.selectedTruckOwnership === this.truckRentaled) {
      if (!this.selectedTruckRental) {
        this.messageService.add({
          severity: Constant.messageStatus.warn,
          detail: "Vui lòng chọn đơn vị thuê"
        });
        return;
      }
    }

    if (this.selectedTruckRental) {
      this.dataUpdate.truckRentalId = this.selectedTruckRental;
      this.dataUpdate.truckRentalName= this.truckRentals.find(x => x.value === this.selectedTruckRental).label;
    } else {
      this.dataUpdate.truckRentalId = null;
      this.dataUpdate.truckRentalName= null;
    }

    if (this.dataUpdate.id) {
      const res = await this.truckService.updateAsync(this.dataUpdate);
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
      // console.log(JSON.stringify(this.dataUpdate));
      const res = await this.truckService.createAsync(this.dataUpdate);
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
    this.modalTitle = "Hủy kiểu xe";
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
    this.dataDelete = data;
  }

  async delete() {
    let obj = new BaseModel(this.dataDelete.id);
    const data = await this.truckService.deleteAsync(obj);
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
    this.selectedTruckType = null;
    this.selectedTruckOwnership = null;
    this.selectedTruckRental = null;
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
