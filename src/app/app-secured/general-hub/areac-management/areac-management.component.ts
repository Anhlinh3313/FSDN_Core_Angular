import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { Constant } from '../../../infrastructure/constant';
import { AreaC } from '../../../models';
import { LazyLoadEvent } from 'primeng/primeng';
import { BaseModel } from '../../../models/base.model';
import { AreaCService, HubService, PermissionService } from '../../../services';
import { MessageService } from 'primeng/components/common/messageservice';
import { FilterUtil } from '../../../infrastructure/filter.util';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { KeyCodeUtil } from '../../../infrastructure/keyCode.util';
import { Router } from '@angular/router';
import { SelectModel } from '../../../models/select.model';
import { GeocodingApiService } from '../../../services/geocodingApiService.service';
import { Table } from 'primeng/table';
import { environment } from '../../../../environments/environment';

declare var jQuery: any;

@Component({
  selector: 'app-areac-management',
  templateUrl: 'areac-management.component.html',
  styles: []
})
export class AreaCManagementComponent extends BaseComponent implements OnInit {
  changeHubName = environment.hub;

  constructor(private modalService: BsModalService, protected messageService: MessageService,
    private hubService: HubService, private areaCService: AreaCService,
    protected geocodingApiService: GeocodingApiService,
    public permissionService: PermissionService,
    public router: Router) {
    super(messageService, permissionService, router);
  }

  parentPage: string = Constant.pages.generalHub.name;
  currentPage: string = Constant.pages.generalHub.childrens.hubStationManagement.name;
  modalTitle: string;
  bsModalRef: BsModalRef;
  displayDialog: boolean;
  data: AreaC;
  isNew: boolean;
  listData: AreaC[];
  selectedData: AreaC;
  //
  columns: string[] = ["code", "name"];
  datasource: AreaC[];
  totalRecords: number;
  rowPerPage: number = 10;
  //
  centerHubs: SelectModel[] = [];
  selectedCenterHub: number;
  //
  poHubs: SelectModel[] = [];
  selectedPoHub: number;
  //
  cloneWardName: string;
  cloneDistrictName: string;
  cloneProviceName: string;
  //
  colsTable = [
    { field: 'code', header: 'Mã' },
    { field: 'name', header: 'Tên' },
    { field: 'poHub.name', header: 'Chi nhánh' },
  ]
  //
  @ViewChild('filterGb') filterGb: ElementRef;

  ngOnInit() {
    this.initData();
    // this.loadProvinces(true);
  }

  async initData() {
    let includes = [];
    includes.push(Constant.classes.includes.hub.pOHub);

    await this.areaCService.getAll(includes).toPromise().then(
      x => {
        if (!this.isValidResponse(x)) return;
        this.datasource = x.data as AreaC[];
        this.totalRecords = this.datasource.length;
        this.listData = this.datasource
      }
    );

    this.centerHubs = await this.hubService.getSelectModelCenterHubAsync();

    this.filterGb.nativeElement.value = null;
    this.data = null;
    this.isNew = true;
  }


  async loadPoHubs(isNew: boolean) {
    this.poHubs = await this.hubService.getSelectModelPoHubByCenterIdbAsync(this.selectedCenterHub);
    if (this.poHubs.length > 0 && isNew) {
      this.selectedPoHub = this.poHubs[0].value;
    }
  }

  changeCenterHub() {
    this.loadPoHubs(true);
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

  openModel(template: TemplateRef<any>, data: AreaC = null) {
    if (data) {
      this.modalTitle = "Xem chi tiết";
      this.isNew = false;
      this.data = this.clone(data);
      this.selectedData = data;
      if (this.data.poHub) this.selectedCenterHub = this.data.poHub.centerHubId;
      this.selectedPoHub = this.data.poHubId;
      this.loadPoHubs(false);
    } else {
      this.modalTitle = "Tạo mới";
      this.isNew = true;
      this.data = new AreaC();
      this.selectedCenterHub = null;
      this.selectedPoHub = null;
    }
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }

  openDeleteModel(template: TemplateRef<any>, data: AreaC) {
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
        // filterRows = SortUtil.sortAlphanumerical(filterRows, "name");
        filterRows.sort((a, b) => FilterUtil.compareField(a, b, event.sortField) * event.sortOrder);
        this.listData = filterRows.slice(event.first, (event.first + event.rows));
        this.totalRecords = filterRows.length;

        // this.listData = filterRows.slice(event.first, (event.first + event.rows));
      }
    }, 250);
  }

  refresh(td: Table) {
    td.reset();
    this.initData();
  }

  save() {
    let list = [...this.listData];
    if (this.selectedPoHub) {
      this.data.poHubId = this.selectedPoHub;
    } else {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: 'Vui lòng chọn chi nhánh!' });
      return
    }
    if (this.isNew) {
      this.areaCService.create(this.data).subscribe(x => {
        if (!super.isValidResponse(x)) return;

        var obj = (x.data as AreaC);
        this.mapSaveData(obj);
        list.push(this.data);
        this.datasource.push(this.data);
        this.saveClient(list);
      });
    }
    else {
      this.areaCService.update(this.data).subscribe(x => {
        if (!super.isValidResponse(x)) return;

        var obj = (x.data as AreaC);
        this.mapSaveData(obj);
        list[this.findSelectedDataIndex()] = this.data;
        this.datasource[this.datasource.indexOf(this.selectedData)] = this.data;
        this.saveClient(list);
      });
    }
  }

  mapSaveData(obj: AreaC) {
    if (obj) {
      this.data.id = obj.id;
      this.data.concurrencyStamp = obj.concurrencyStamp;
      this.data.poHub = this.poHubs.find(x => x.value == this.selectedPoHub).data;
    }
  }

  delete() {
    this.areaCService.delete(new BaseModel(this.data.id)).subscribe(x => {
      if (!super.isValidResponse(x)) return;

      let index = this.findSelectedDataIndex();
      var list = this.listData.filter((val, i) => i != index);
      this.datasource.splice(this.datasource.indexOf(this.selectedData), 1);

      this.saveClient(list);
    });
  }

  saveClient(list: AreaC[]) {
    this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Cập nhật thành công' });
    this.listData = list;
    this.data = null;
    this.selectedData = null;
    this.poHubs = null;
    this.selectedPoHub = null;
    this.bsModalRef.hide();
  }

  clone(model: AreaC): AreaC {
    let data = new AreaC();
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
