import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { Constant } from '../../../infrastructure/constant';
import { District, Province } from '../../../models';
import { LazyLoadEvent } from 'primeng/primeng';
import { BaseModel } from '../../../models/base.model';
import { DistrictService, ProvinceService, PermissionService } from '../../../services';
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
  selector: 'app-district-management',
  templateUrl: 'district-management.component.html',
  styles: []
})
export class DistrictManagementComponent extends BaseComponent implements OnInit {

  constructor(private modalService: BsModalService, protected messageService: MessageService,
    private districtService: DistrictService,
    private provinceService: ProvinceService,
    public permissionService: PermissionService,
    public router: Router
  ) {
    super(messageService, permissionService, router);
  }

  parentPage: string = Constant.pages.generalLocation.name;
  currentPage: string = Constant.pages.generalLocation.childrens.districtManagement.name;
  modalTitle: string;
  bsModalRef: BsModalRef;
  displayDialog: boolean;
  data: District;
  selectedData: District;
  isNew: boolean;
  listData: District[];
  //
  columns: string[] = ["code", "name", "province.name"];
  datasource: District[];
  totalRecords: number;
  rowPerPage: number = 10;
  //
  provinces: SelectModel[];
  selectedProvince: number;
  //
  colsDistrict = [
    { field: 'code', header: 'Mã' },
    { field: 'name', header: 'Tên' },
    { field: 'province.name', header: 'Tỉnh thành' },
  ]
  //
  @ViewChild('filterGb') filterGb: ElementRef;

  ngOnInit() {
    this.initData();
  }

  async initData() {
    let includes = [];
    includes.push(Constant.classes.includes.district.province);

    const districts = await this.districtService.getAllAsync(includes);
    if (districts) {
      this.datasource = districts as District[];
      this.totalRecords = this.datasource.length;
      this.listData =  this.datasource;
    }

    // const provinces = await this.provinceService.getAllAsync();
    // if (provinces) {
    //   this.provinces = provinces as Province[];
    // }

    this.provinces = await this.provinceService.getSelectModelAllAsync();

    this.filterGb.nativeElement.value = null;
    this.data = null;
    this.selectedData = null;
    this.isNew = true;
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

  openModel(template: TemplateRef<any>, data: District = null) {
    if (data) {
      this.modalTitle = "Xem chi tiết";
      this.isNew = false;
      this.data = this.clone(data);
      this.selectedData = data;
      this.selectedProvince = this.data.provinceId;
    } else {
      this.modalTitle = "Tạo mới";
      this.isNew = true;
      this.data = new District();
      this.selectedProvince = null;
    }
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }

  openDeleteModel(template: TemplateRef<any>, data: District) {
    this.selectedData = data;
    this.data = this.clone(data);
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
        // filterRows = SortUtil.sortAlphanumerical(filterRows, "name");
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
    if (this.isNew) {
      if (this.selectedProvince) {
        this.data.provinceId = this.selectedProvince;
      }

      this.districtService.create(this.data).subscribe(x => {
        if (!super.isValidResponse(x)) return;

        var obj = (x.data as District);
        this.mapSaveData(obj);
        list.push(this.data);
        this.datasource.push(this.data);
        this.saveClient(list);
      });
    }
    else {
      this.districtService.update(this.data).subscribe(x => {
        if (!super.isValidResponse(x)) return;

        var obj = (x.data as District);
        this.mapSaveData(obj);
        list[this.findSelectedDataIndex()] = this.data;
        this.datasource[this.datasource.indexOf(this.selectedData)] = this.data;
        this.saveClient(list);
      });
    }
  }

  mapSaveData(obj: District) {
    if (obj) {
      this.data.id = obj.id;
      this.data.concurrencyStamp = obj.concurrencyStamp;
      this.data.province = this.provinces.find(x => x.value == this.selectedProvince).data;
    }
  }

  delete() {
    this.districtService.delete(new BaseModel(this.data.id)).subscribe(x => {
      if (!super.isValidResponse(x)) return;

      let index = this.findSelectedDataIndex();
      this.datasource.splice(this.datasource.indexOf(this.selectedData), 1);
      this.saveClient(this.listData.filter((val, i) => i != index));
    });
  }

  saveClient(list: District[]) {
    this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Cập nhật thành công' });
    this.listData = list;
    this.data = null;
    this.selectedData = null;
    this.selectedProvince = null;
    this.bsModalRef.hide();
  }

  compareFn(c1: Province, c2: Province): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  clone(model: District): District {
    let data = new District();
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
}
