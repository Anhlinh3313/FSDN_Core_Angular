import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { Constant } from '../../../infrastructure/constant';
import { Role } from '../../../models/role.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { BaseModel } from '../../../models/base.model';
import { RoleService, PermissionService } from '../../../services';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/message';
import { ResponseModel } from '../../../models/response.model';
import { FilterUtil } from '../../../infrastructure/filter.util';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { KeyCodeUtil } from '../../../infrastructure/keyCode.util';
import { Router } from '@angular/router';
import { SortUtil } from '../../../infrastructure/sort.util';
import { Table } from 'primeng/table';
import { SelectModel } from '../../../models/select.model';

declare var jQuery: any;

@Component({
  selector: 'app-role-management',
  templateUrl: 'role-management.component.html',
  styles: []
})
export class RoleManagementComponent extends BaseComponent implements OnInit {

  constructor(private modalService: BsModalService, private roleService: RoleService,
    protected messageService: MessageService,
    public permissionService: PermissionService,
    public router: Router) {
    super(messageService, permissionService, router);
  }

  parentPage: string = Constant.pages.general.name;
  currentPage: string = Constant.pages.general.childrens.roleManagement.name;
  modalTitle: string;
  bsModalRef: BsModalRef;
  displayDialog: boolean;
  data: Role;
  selectedData: Role;
  isNew: boolean;
  listData: Role[];
  //
  columns: string[] = ["code", "name"];
  datasource: Role[];
  totalRecords: number;
  rowPerPage: number = 10;
  //
  parrentRoleName: any[];
  parrentRole: SelectModel[];
  selectedParrentRole: number;
  //
  colsRole = [
    { field: 'code', header: 'Mã' },
    { field: 'name', header: 'Tên' },
  ]

  @ViewChild('filterGb') filterGb: ElementRef;

  ngOnInit() {
    this.initData();
  }

  async initData() {
    //==================
    this.parrentRole = await this.roleService.getSelectModelAsync();
    if (this.parrentRole.length > 0) {
      this.selectedParrentRole = this.parrentRole[0].value;
    }
    //==================
    let includes = [];
    includes.push(Constant.classes.includes.user.role);
    const data = await this.roleService.getAllAsync(includes);
    if (data) {
      this.datasource = data as Role[];
      this.totalRecords = this.datasource.length;
      this.listData = this.datasource;
    }

    this.filterGb.nativeElement.value = null;
    this.data = null;
    this.selectedData = null;
    this.isNew = true;
  }

  ngAfterViewInit() {
    // jQuery(document).ready(function () {
    //   jQuery('.i-checks').iCheck({
    //     checkboxClass: 'icheckbox_square-green',
    //     radioClass: 'iradio_square-green',
    //   });
    //   jQuery('.footable').footable();
    // });
  }

  openModel(template: TemplateRef<any>, data: Role = null) {
    if (data) {
      this.modalTitle = "Xem chi tiết";
      this.isNew = false;
      this.data = this.clone(data);
      this.selectedParrentRole = this.data.parrentRoleId;
      this.selectedData = data;
    } else {
      this.modalTitle = "Tạo mới";
      this.isNew = true;
      this.data = new Role();
    }
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }

  openDeleteModel(template: TemplateRef<any>, data: Role) {
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
        this.listData = filterRows.slice(event.first, (event.first + event.rows))
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
      //==================
      var objData: Role = new Role();
      objData.id = this.data.id;
      objData.code = this.data.code;
      objData.name = this.data.name;
      objData.parrentRoleId = this.selectedParrentRole;
      objData.concurrencyStamp = this.data.concurrencyStamp;
      //==================
      this.roleService.create(objData).subscribe(x => {
        if (!super.isValidResponse(x)) return;

        var obj = (x.data as Role);
        this.mapSaveData(obj);
        list.push(this.data);
        this.datasource.push(this.data);
        this.saveClient(list);
        //==================
        this.initData();
        this.bsModalRef.hide();
      });
    }
    else {
      //==================
      var objData: Role = new Role();
      objData.id = this.data.id;
      objData.code = this.data.code;
      objData.name = this.data.name;
      objData.parrentRoleId = this.selectedParrentRole;
      objData.concurrencyStamp = this.data.concurrencyStamp;
      //==================
      this.roleService.update(objData).subscribe(x => {
        if (!super.isValidResponse(x)) return;
        var obj = (x.data as Role);
        this.mapSaveData(obj);
        list[this.findSelectedDataIndex()] = this.data;
        this.datasource[this.datasource.indexOf(this.selectedData)] = this.data;
        this.saveClient(list);
        //==================
        this.initData();
        this.bsModalRef.hide();
      });

    }
  }

  mapSaveData(obj: Role) {
    if (obj) {
      this.data.id = obj.id;
      this.data.concurrencyStamp = obj.concurrencyStamp;
    }
  }

  delete() {
    this.roleService.delete(new BaseModel(this.data.id)).subscribe(x => {
      if (!super.isValidResponse(x)) return;

      // let index = this.findSelectedDataIndex();
      // this.listData.splice(this.listData.indexOf(this.selectedData), 1);
      // this.saveClient(this.listData.filter((val, i) => i != index));
      this.initData();
      this.bsModalRef.hide();
    });
  }

  saveClient(list: Role[]) {
    this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Cập nhật thành công' });
    this.listData = list;
    this.data = null;
    this.selectedData = null;
    this.bsModalRef.hide();
  }

  clone(model: Role): Role {
    let data = new Role();
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
  changeParrentRole() {
    console.log(this.selectedParrentRole);
  }
}
