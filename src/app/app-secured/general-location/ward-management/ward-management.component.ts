import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { Constant } from '../../../infrastructure/constant';
import { Ward, District, Province } from '../../../models';
import { LazyLoadEvent } from 'primeng/primeng';
import { BaseModel } from '../../../models/base.model';
import { WardService, DistrictService, ProvinceService, PermissionService } from '../../../services';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/message';
import { ResponseModel } from '../../../models/response.model';
import { FilterUtil } from '../../../infrastructure/filter.util';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { KeyCodeUtil } from '../../../infrastructure/keyCode.util';
import { Router } from '@angular/router';
import { SortUtil } from '../../../infrastructure/sort.util';
import { SelectModel } from '../../../models/select.model';
import { Table } from 'primeng/table';

declare var jQuery: any;

@Component({
  selector: 'app-ward-management',
  templateUrl: 'ward-management.component.html',
  styles: []
})
export class WardManagementComponent extends BaseComponent implements OnInit {

  constructor(private modalService: BsModalService,
    protected messageService: MessageService,
    private wardService: WardService,
    private provinceService: ProvinceService,
    private districtService: DistrictService,
    public permissionService: PermissionService,
    public router: Router) {
    super(messageService, permissionService, router);
  }

  parentPage: string = Constant.pages.generalLocation.name;
  currentPage: string = Constant.pages.generalLocation.childrens.wardManagement.name;
  modalTitle: string;
  bsModalRef: BsModalRef;
  displayDialog: boolean;
  data: Ward = new Ward();
  isNew: boolean;
  listData: Ward[];
  selectedData: Ward;
  isRemote: boolean = false;
  kmNumber: number = 0;
  //
  columns: string[] = ["code", "name", "district.name"];
  datasource: Ward[];
  totalRecords: number;
  rowPerPage: number = 10;
  //
  districts: SelectModel[] = [];
  selectedDistrict: number = 0;
  //
  provinces: SelectModel[] = [];
  selectedProvince: number;
  //
  colsWard = [
    { field: 'code', header: 'Mã' },
    { field: 'name', header: 'Tên' },
    { field: 'district.name', header: 'Quận huyện' },
  ]
  //
  @ViewChild('filterGb') filterGb: ElementRef;

  ngOnInit() {
    this.initData();
  }

  async initData() {
    let includes = [];
    includes.push(Constant.classes.includes.ward.district);

    const wards = await this.wardService.getAllAsync(includes);
    if (wards) {
      this.datasource = wards as Ward[];
      this.totalRecords = this.datasource.length;
      this.listData = this.datasource;
    }

    this.provinces = await this.provinceService.getSelectModelAllAsync();

    this.filterGb.nativeElement.value = null;
    this.isNew = true;
  }

  async loadDistricts(isNew: boolean) {

    let districts = await this.districtService.getSelectModelDistrictByProvinceIdAsync(this.selectedProvince)
    // districts = SortUtil.sortAlphanumerical(districts, "name");
    if (districts.length > 0 && isNew) {
      this.selectedDistrict = districts[0].value;
    }
    this.districts = districts;
  }

  ngAfterViewInit() {
    jQuery(document).ready(function () {
      jQuery('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
      });
      jQuery('.footable').footable();
    });
  }

  openModel(template: TemplateRef<any>, data: Ward = null) {
    if (data) {
      this.modalTitle = "Xem chi tiết";
      this.isNew = false;
      this.data = this.clone(data);
      this.isRemote = this.data.isRemote;
      this.kmNumber = this.data.kmNumber;
      this.selectedData = data;
      this.selectedProvince = this.data.district.provinceId;
      this.selectedDistrict = this.data.districtId;
      this.loadDistricts(false);
    } else {
      this.modalTitle = "Tạo mới";
      this.isNew = true;
      this.data = new Ward();
      this.selectedProvince = 0;
      this.districts = null;
      this.isRemote = false;
      this.kmNumber = 0;
    }
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }

  openDeleteModel(template: TemplateRef<any>, data: Ward) {
    this.data = this.clone(data);
    this.selectedData = data;
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }

  loadLazy(event: LazyLoadEvent) {
    //in a real application, make a remote request to load data using state metadata from event
    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    //imitate db connection over a network
    setTimeout(() => {
      if (this.datasource) {
        var filterRows;

        //filter
        if (event.filters.length > 0)
          filterRows = this.datasource.filter(x => FilterUtil.filterField(x, event.filters));
        else
          filterRows = this.datasource.filter(x => FilterUtil.gbFilterFiled(x, event.globalFilter, this.columns));

        // sort data
        // this.datasource = SortUtil.sortAlphanumerical(this.datasource, "name");
        filterRows.sort((a, b) => FilterUtil.compareField(a, b, event.sortField) * event.sortOrder);
        this.listData = filterRows.slice(event.first, (event.first + event.rows));
        this.totalRecords = filterRows.length;

        // this.listData = filterRows.slice(event.first, (event.first + event.rows));
      }
    }, 250);
  }

  refresh(dt: Table) {
    dt.reset();
    this.initData();
  }

  save() {
    let list = [...this.listData];
    if (this.selectedDistrict) {
      this.data.districtId = this.selectedDistrict;
    }
    this.data.isRemote = this.isRemote;
    this.data.kmNumber = this.kmNumber;
    if (this.isNew) {
      this.wardService.create(this.data).subscribe(x => {
        if (!super.isValidResponse(x)) return;

        var obj = (x.data as Ward);
        this.mapSaveData(obj);
        list.push(this.data);
        this.datasource.push(this.data);
        this.saveClient(list);
      });
    }
    else {
      this.wardService.update(this.data).subscribe(x => {
        if (!super.isValidResponse(x)) return;

        var obj = (x.data as Ward);
        this.mapSaveData(obj);
        list[this.findSelectedDataIndex()] = this.data;
        this.datasource[this.datasource.indexOf(this.selectedData)] = this.data;
        this.saveClient(list);
      });
    }
  }

  mapSaveData(obj: Ward) {
    if (obj) {
      this.data.id = obj.id;
      this.data.concurrencyStamp = obj.concurrencyStamp;
      this.data.district = this.districts.find(x => x.value == this.selectedDistrict).data;
      this.data.district.province = this.provinces.find(x => x.value == this.selectedProvince).data;
    }
  }

  delete() {
    this.wardService.delete(new BaseModel(this.data.id)).subscribe(x => {
      if (!super.isValidResponse(x)) return;

      let index = this.findSelectedDataIndex();
      this.datasource.splice(this.datasource.indexOf(this.selectedData), 1);
      this.saveClient(this.listData.filter((val, i) => i != index));
    });
  }

  saveClient(list: Ward[]) {
    this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Cập nhật thành công' });
    this.listData = list;
    this.data = null;
    this.selectedData = null;
    this.selectedProvince = 0;
    this.selectedDistrict = 0 ;
    this.districts = null;
    this.bsModalRef.hide();
  }

  changeProvince() {
    this.loadDistricts(true);
  }

  compareFn(c1: District, c2: District): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  clone(model: Ward): Ward {
    let data = new Ward();
    for (let prop in model) {
      data[prop] = model[prop];
    }
    return data;
  }

  findSelectedDataIndex(): number {
    return this.listData.indexOf(this.selectedData);
  }

  keyDownFunction(event) {
    if ((event.ctrlKey || event.metaKey) && event.which === KeyCodeUtil.charS) {
      this.save();
      event.preventDefault();
      return false;
    }
  }
  clickChange(){
    this.kmNumber = 0;
  }
}
