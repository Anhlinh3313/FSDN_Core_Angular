import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { UserService, ModulePageService, RoleService, PageService, PermissionService } from '../../../services/index';
import { Constant } from '../../../infrastructure/constant';
import { Page, BaseModel } from '../../../models/index';
import { FilterUtil } from '../../../infrastructure/filter.util';
import { Router } from '@angular/router';
import { SortUtil } from '../../../infrastructure/sort.util';

declare var jQuery: any;

@Component({
  selector: 'app-menu',
  templateUrl: 'menu-management.component.html',
  styles: [`
  body .ui-inputtext{
    padding:0px !important;
  }
  `]
})
export class MenuManagementComponent extends BaseComponent implements OnInit {
  parentPage: string = Constant.pages.generalMenu.name;
  currentPage: string = Constant.pages.generalMenu.childrens.menu.name;
  modalTitle: string;
  //
  totalRecords: number;
  rowPerPage: number = 10;
  //
  dataPages: Page[];
  listPage: Page[] = [];
  data: Page;
  selectedData: Page;
  //
  selectedModule: SelectItem[];
  selectedParentPage: any = [];
  //
  parentPageName: any = [];
  //
  columns: string[] = ["code", "name", "aliasPath", "modulePageId", "pageOrder", "isAccess", "isEnabled"];
  optionModule: any = [
    {
      value: null,
      label: "Chọn Module"
    },
    {
      value: "1",
      label: "Core"
    },
    {
      value: "2",
      label: "Crm"
    },
    {
      value: "3",
      label: "Post"
    },    {
      value: "4",
      label: "Hrm"
    }
  ]
  //
  isNew: boolean
  //
  bsModalRef: BsModalRef;
  //
  colsTable = [
    { field: 'code', header: 'Mã' },
    { field: 'name', header: 'Tên' },
    { field: 'aliasPath', header: 'Url' },
    { field: 'parentPageId', header: 'Menu Cha' },
    { field: 'modulePageId', header: 'Module' },
    { field: 'pageOrder', header: 'Thứ Tự' },
    { field: 'isAccess', header: 'isAccess' },
    { field: 'isAdd', header: 'isAdd' },
    { field: 'isEdit', header: 'isEdit' },
    { field: 'isDelete', header: 'isDelete' },
    { field: 'isEnabled', header: 'isEnabled' },
  ]
  //
  constructor(
    protected messageService: MessageService,
    private userService: UserService,
    private modalService: BsModalService,
    private modulePageService: ModulePageService,
    private roleService: RoleService,
    private pageService: PageService,
    public permissionService: PermissionService, public router: Router
  ) {
    super(messageService, permissionService, router);
  }

  ngOnInit() {
    this.initData();
  }
  async initData() {
    
    const pages = await this.pageService.getAllAsync();
    if (pages) {
      var name: any = [];
      this.dataPages = pages as Page[];
      this.totalRecords = this.dataPages.length;
      this.listPage = this.dataPages;
      this.dataPages.map(x => {
        if (x.parentPageId == null && x.name != "Thay đổi mật khẩu" && x.name != "Dashboard") {
          this.selectedParentPage.push({ value: x.id, label: x.name });
        }
      });
      this.selectedParentPage = SortUtil.sortAlphanumerical(this.selectedParentPage, "label");
      this.selectedParentPage.unshift({ label: "Chọn Menu cha" });
    }
  }
  refresh() {
    this.initData();
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

  loadLazy(event: LazyLoadEvent) {
    //in a real application, make a remote request to load data using state metadata from event
    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    //imitate db connection over a network
    setTimeout(() => {
      if (this.dataPages) {
        var filterRows;

        //filter
        if (event.filters.length > 0)
          filterRows = this.dataPages.filter(x => FilterUtil.filterField(x, event.filters));
        else
          filterRows = this.dataPages.filter(x => FilterUtil.gbFilterFiled(x, event.globalFilter, this.columns));

        // sort data
        // filterRows = SortUtil.sortAlphanumerical(filterRows, "name");
        filterRows.sort((a, b) => FilterUtil.compareField(a, b, event.sortField) * event.sortOrder);
        this.listPage = filterRows.slice(event.first, (event.first + event.rows))
        this.totalRecords = filterRows.length;

        // this.listData = filterRows.slice(event.first, (event.first + event.rows));
      }
    }, 250);
  }
  openModel(template: TemplateRef<any>, data: Page = null) {
    if (data) {
      this.modalTitle = "Xem chi tiết";
      this.isNew = false;
      this.data = this.clone(data);
      this.selectedData = data;
    } else {
      this.modalTitle = "Tạo mới";
      this.isNew = true;
      this.data = new Page();
    }
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }
  openDeleteModel(template: TemplateRef<any>, data: Page) {
    this.data = this.clone(data);
    this.selectedData = data;
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }
  //Update/Create
  save() {
    let list = [...this.listPage];
    if (this.isNew) {
      if (this.validation()) return;
      this.pageService.create(this.data).subscribe(x => {
        if (!super.isValidResponse(x)) return;

        var obj = (x.data as Page);
        this.mapSaveData(obj);
        list.push(this.data);
        this.dataPages.push(this.data);
        this.saveClient(list);
      });
    }
    else {
      if (this.validation()) return;
      this.pageService.update(this.data).subscribe(x => {
        if (!super.isValidResponse(x)) return;
        var obj = (x.data as Page);
        this.mapSaveData(obj);
        list[this.findSelectedDataIndex()] = this.data;
        this.dataPages[this.dataPages.indexOf(this.selectedData)] = this.data;
        this.saveClient(list);
      });
    }
  }
  delete() {
    this.pageService.delete(new BaseModel(this.data.id)).subscribe(x => {
      if (!super.isValidResponse(x)) return;

      let index = this.findSelectedDataIndex();
      this.dataPages.splice(this.dataPages.indexOf(this.selectedData), 1);
      this.saveClient(this.listPage.filter((val, i) => i != index));
    });
  }
  findSelectedDataIndex(): number {
    return this.listPage.indexOf(this.selectedData);
  }
  mapSaveData(obj: Page) {
    if (obj) {
      this.data.id = obj.id;
      this.data.concurrencyStamp = obj.concurrencyStamp;
    }
  }
  saveClient(list: Page[]) {
    this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Cập nhật thành công' });
    this.listPage = list;
    this.data = null;
    this.selectedData = null;
    this.bsModalRef.hide();
  }
  clone(model: Page): Page {
    let data = new Page();
    for (let prop in model) {
      data[prop] = model[prop];
    }
    return data;
  }
  validation() {
    if (!this.data.code) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: 'Mã không được để trống.' });
      return;
    }
    if (!this.data.name) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: 'Tên không được để trống.' });
      return;
    }
    if (!this.data.aliasPath) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: 'Đường dẫn không được để trống.' });
      return;
    }
    if (!this.data.modulePageId) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: 'Module không được để trống.' });
      return;
    }
  }
  nameChange() {
    this.data.code = this.removeCharactersVI(this.data.name);
  }

  removeCharactersVI(obj: string): string {
    if (!obj) {
      return "";
    }
    let str;
    str = obj;
    str = str.toLowerCase().trim();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    //str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");  
    /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
    //str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1-  
    str = str.replace(/^\-+|\-+$/g, "");
    str = str.replace(/ /g, "-");
    //cắt bỏ ký tự - ở đầu và cuối chuỗi 
    return str.toLowerCase();
  }
}
