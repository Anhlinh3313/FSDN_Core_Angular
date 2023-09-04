import { Component, OnInit, TemplateRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { Constant } from '../../../infrastructure/constant';
import { User, Department, Hub, Role, Province, District, Ward } from '../../../models';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { BaseModel } from '../../../models/base.model';
import { UserService, DepartmentService, RoleService, HubService, ProvinceService, DistrictService, WardService, PermissionService } from '../../../services';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/message';
import { ResponseModel } from '../../../models/response.model';
import { FilterUtil } from '../../../infrastructure/filter.util';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { KeyCodeUtil } from '../../../infrastructure/keyCode.util';
//google.maps
import { GMapHelper } from '../../../infrastructure/gmap.helper';
import { Router } from '@angular/router';
import { SelectModel } from '../../../models/select.model';
import { SortUtil } from '../../../infrastructure/sort.util';
import { environment } from '../../../../environments/environment';
import { UserFilterModel } from '../../../models/userFilter.model';
import { Table } from 'primeng/table';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

declare var jQuery: any;

@Component({
  selector: 'app-user-management',
  templateUrl: 'user-management.component.html',
  styles: []
})
export class UserManagementComponent extends BaseComponent implements OnInit {
  wopts: XLSX.WritingOptions = { bookType: "xlsx", type: "binary" };
  fileName: string = "DSNV.xlsx";
  changeHubName = environment.hub;
  namePrint = environment.namePrint;

  constructor(private modalService: BsModalService, protected messageService: MessageService,
    private userService: UserService, private departmentService: DepartmentService, private roleService: RoleService,
    private hubService: HubService, public permissionService: PermissionService, public router: Router
  ) {
    super(messageService, permissionService, router);
  }

  @ViewChild("dt") dt: Table;

  cols: any = [
    Constant.classes.includes.user.department,
    Constant.classes.includes.user.role,
    Constant.classes.includes.user.hub
  ].join(',');

  userFilterModel: UserFilterModel;

  parentPage: string = Constant.pages.general.name;
  currentPage: string = Constant.pages.general.childrens.userManagement.name;
  modalTitle: string;
  bsModalRef: BsModalRef;
  displayDialog: boolean;
  data: User;
  selectedData: User;
  isNew: boolean;
  listData: User[];
  passWord: string;
  blockTime: number = 36000;
  //

  colsUser = [
    { field: 'code', header: 'Mã' },
    { field: 'userName', header: 'Tên đăng nhập' },
    { field: 'fullName', header: 'Họ & tên' },
    { field: 'phoneNumber', header: 'Số điện thoại' },
    { field: 'email', header: 'Email' },
    { field: 'role.name', header: 'Chức vụ' },
    { field: 'department.name', header: 'Phòng ban' },
    { field: 'hub.name', header: 'TT/CN/T' },
  ]

  columns: string[] = ["code", "userName", "fullName", "phoneNumber", "email", "department.name", "role.name", "hub.name"];
  datasource: User[];
  totalRecords: number;
  rowPerPage: number = 10;
  //
  departments: SelectModel[];
  selectedDepartment: any;
  //
  roles: SelectItem[];
  selectedRole: number[] = [];
  //
  hubsFilter: SelectModel[] = [];
  hubs: SelectModel[];
  selectedHub: number;
  //
  hubRadios = [
    { value: "centerHub", name: "Trung tâm" },
    { value: "poHub", name: "Chi nhánh" },
    { value: "stationHub", name: "Trạm" },
  ];
  selectedHubRadio = null;

  //
  @ViewChild('filterGb') filterGb: ElementRef;

  ngOnInit() {
    this.loadHubFilter();
    this.resetFilter();
    this.initData();
  }

  async loadHubFilter() {
    this.hubsFilter = await this.hubService.getAllSelectModelAsync();
  }

  resetFilter() {
    this.userFilterModel = new UserFilterModel();
    this.userFilterModel.pageNumber = 1;
    this.userFilterModel.pageSize = 10;
    this.userFilterModel.cols = this.cols;
    this.userFilterModel.searchText = "";
  }

  async loadData() {
    let res = await this.userService.search(this.userFilterModel);
    if (!super.isValidResponse(res)) return;
    this.listData = this.datasource = res.data;
    this.totalRecords = res["dataCount"];
  }

  async initData() {
    this.loadData();

    // let includes = [];
    // includes.push(Constant.classes.includes.user.department);
    // includes.push(Constant.classes.includes.user.role);
    // includes.push(Constant.classes.includes.user.hub);

    // this.userService.getAll(includes).subscribe(
    //   x => {
    //     if (!super.isValidResponse(x)) return;
    //     this.datasource = x.data as User[];
    //     this.datasource = SortUtil.sortAlphanumerical(this.datasource, "fullName");
    //     this.totalRecords = this.datasource.length;
    //     this.listData = this.datasource.slice(0, this.rowPerPage);
    //   }
    // );

    this.departmentService.getAll().subscribe(
      x => {
        if (!super.isValidResponse(x)) return;
        this.departments = [];
        let department = x.data as Department[];
        department.forEach(x => {
          this.departments.push({ label: x.name, value: x.id, data: x });
        });
      }
    )

    const roles = await this.roleService.getAllAsync();
    if (roles) {
      this.roles = [];
      roles.forEach(role => {
        this.roles.push({ label: role.name, value: role.id });
      });
    }

    this.filterGb.nativeElement.value = null;
    this.data = null;
    this.selectedData = null;
    this.onChangeHubRadios(this.hubRadios[0]);
    this.isNew = true;
  }

  async loadHub(isNew: boolean) {
    switch (this.selectedHubRadio.value) {
      case "centerHub": {
        const centerHubs = await this.hubService.getSelectModelCenterHubAsync();
        if (centerHubs) {
          this.hubs = centerHubs as SelectItem[];
          if (this.hubs.length > 0 && isNew) {
            this.selectedHub = this.hubs[0].value;
          }
        }
        break;
      }
      case "poHub": {
        const poHubs = await this.hubService.getSelectModelPoHubAsync();
        if (poHubs) {
          this.hubs = poHubs as SelectItem[];
          if (this.hubs.length > 0 && isNew) {
            this.selectedHub = this.hubs[0].value;
          }
        }
        break;
      }
      case "stationHub": {
        const stationHubs = await this.hubService.getSelectModelStationHubbAsync();
        if (stationHubs) {
          this.hubs = stationHubs as SelectItem[];
          if (this.hubs.length > 0 && isNew) {
            this.selectedHub = this.hubs[0].value;
          }
        }
        break;
      }
    }
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

  openModel(template: TemplateRef<any>, data: User = null) {
    if (data) {
      this.modalTitle = "Xem chi tiết";
      this.isNew = false;
      this.data = this.clone(data);
      this.selectedData = data;

      this.selectedDepartment = data.department ? data.department.id : 0;

      this.selectedRole = [];
      if (this.data.roles) {
        this.data.roles.forEach(role => {
          this.selectedRole.push(role.id);
        });
      }

      this.selectedHub = data.hubId;
      this.passWord = null;
      this.blockTime = data.blockTime ? data.blockTime : 36000;
      if (!this.data.hub && (this.data.hub && !this.data.hub.centerHubId)) {
        this.changeHubRadios(this.hubRadios[0], false);
      } else if (this.data.hub && this.data.hub.centerHubId && !this.data.hub.poHubId) {
        this.changeHubRadios(this.hubRadios[1], false);
      } else {
        this.changeHubRadios(this.hubRadios[2], false);
      }
    } else {
      this.modalTitle = "Tạo mới";
      this.isNew = true;
      this.data = new User();
      this.selectedDepartment = this.departments[0].value;
      this.selectedRole = null;
      this.selectedHub = null;
      this.passWord = null;
      this.blockTime = 36000;;
      this.changeHubRadios(this.hubRadios[0], true);
    }
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-md' });
  }

  openDeleteModel(template: TemplateRef<any>, data: User) {
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
        // filterRows = SortUtil.sortAlphanumerical(filterRows, "fullName");
        filterRows.sort((a, b) => FilterUtil.compareField(a, b, event.sortField) * event.sortOrder);
        this.listData = filterRows.slice(event.first, (event.first + event.rows));
        this.totalRecords = filterRows.length;

        // this.listData = filterRows.slice(event.first, (event.first + event.rows));
      }
    }, 250);
  }

  refresh() {
    this.dt.reset();
    this.resetFilter();
    this.initData();
  }

  save() {
    let list = [...this.listData];

    if (this.selectedDepartment) {
      this.data.departmentId = this.selectedDepartment;
    }

    if (this.selectedRole) {
      this.data.roleIds = this.selectedRole;
    }

    if (this.selectedHub) {
      this.data.hubId = this.selectedHub;
    }

    if (this.passWord) {
      this.data.passWord = this.passWord;
    }

    if (this.blockTime) {
      this.data.blockTime = this.blockTime;
    } else {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Block Time không được để trống!" });
      return;
    }

    if (this.isNew) {
      this.userService.create(this.data).subscribe(x => {
        if (!super.isValidResponse(x)) return;

        var obj = (x.data as User);
        this.mapSaveData(obj);
        list.push(this.data);
        this.datasource.push(this.data);
        this.saveClient(list);
        this.refresh();
      });
    }
    else {
      this.userService.update(this.data).subscribe(x => {
        if (!super.isValidResponse(x)) return;

        var obj = (x.data as User);
        this.mapSaveData(obj);
        list[this.findSelectedDataIndex()] = this.data;
        this.datasource[this.datasource.indexOf(this.selectedData)] = this.data;
        this.saveClient(list);
        this.refresh();
      });
    }
  }

  mapSaveData(obj: User) {
    if (obj) {
      this.data.id = obj.id;
      this.data.concurrencyStamp = obj.concurrencyStamp;
      this.data.department = this.departments.find(x => x.value == this.selectedDepartment).data;
      // this.data.roles = this.selectedRole;
      this.data.hub = this.hubs.find(x => x.value == this.selectedHub).value;
    }
  }

  delete() {
    this.userService.delete(new BaseModel(this.data.id)).subscribe(x => {
      if (!super.isValidResponse(x)) return;

      let index = this.findSelectedDataIndex();
      this.datasource.splice(this.datasource.indexOf(this.selectedData), 1);
      this.saveClient(this.listData.filter((val, i) => i != index));
    });
  }

  saveClient(list: User[]) {
    this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Cập nhật thành công' });
    this.listData = list;
    this.data = null;
    this.selectedData = null;
    this.selectedDepartment = null;
    this.selectedRole = null;
    this.selectedHub = null;
    this.selectedHubRadio = null;
    this.passWord = null;
    this.blockTime = null;
    this.bsModalRef.hide();
  }

  changeHubRadios(entry, isNew: boolean) {
    this.selectedHubRadio = entry;
    this.loadHub(isNew);
  }

  onChangeHubRadios(entry) {
    this.changeHubRadios(entry, true);
  }

  compareFn(c1: Department, c2: Department): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  clone(model: User): User {
    let data = new User();
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

  ////google.maps
  loadLocationPlace(place: google.maps.places.PlaceResult) {
    let provinceName = "";
    let districtName = "";
    let wardName = "";
    place.address_components.forEach(element => {
      if (element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_1) !== -1) {
        provinceName = element.long_name;
      }
      else if (element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_2) !== -1) {
        districtName = element.long_name;
      }
      else if (element.types.indexOf(GMapHelper.SUBLOCALITY_LEVEL_1) !== -1) {
        wardName = element.long_name;
      }
    });
  }

  public setAddress(place: google.maps.places.PlaceResult) {
    if (!place.geometry || !place.geometry) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Không tìm thấy địa chỉ" });
      return;
    }
    console.log("place:", place);
    this.loadLocationPlace(place);
    this.data.address = place.formatted_address;
    this.data.lat = place.geometry.location.lat();
    this.data.lng = place.geometry.location.lng();
  }

  showRole(role: Role[]) {
    let roleNames = "";
    role.map(x => roleNames += x.name + ", ");
    return roleNames;
  }

  searchText() {
    this.userFilterModel.pageNumber = 1;
    this.loadData();
  }

  onPageChange(event: any) {
    this.userFilterModel.pageNumber = event.first / event.rows + 1;
    this.userFilterModel.pageSize = event.rows;
    this.loadData();
  }
  exportCSV() {
    this.mapDataExport();
  }

  mapDataExport() {
    let data: any[] = [];
    data.push([
      "Mã NV",
      "Tên đăng nhập",
      "Họ và tên",
      "Điện thoại",
      "Email",
      "Chức vụ",
      "Phòng ban",
      "TT/CN/BC"
    ]);

    this.datasource.map((u) => {
      let user = Object.assign({}, u);
      data.push([
        user.code,
        user.userName,
        user.fullName,
        user.phoneNumber,
        user.email,
        user.role ? user.role.name : "",
        user.department ? user.department.name : "",
        user.hub ? user.hub.name : "",
      ]);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    /* save to file */
    const wbout: string = XLSX.write(wb, this.wopts);
    saveAs(new Blob([this.s2ab(wbout)]), this.fileName);
  }

  s2ab(s: string): ArrayBuffer {
    const buf: ArrayBuffer = new ArrayBuffer(s.length);
    const view: Uint8Array = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
}
