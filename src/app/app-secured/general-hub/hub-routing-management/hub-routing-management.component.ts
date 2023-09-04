import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { Constant } from '../../../infrastructure/constant';
import { Hub } from '../../../models/hub.model';
import { LazyLoadEvent, Column } from 'primeng/primeng';
import { BaseModel } from '../../../models/base.model';
import { HubService, HubRoutingService, UserService, PermissionService, AuthService } from '../../../services';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/message';
import { ResponseModel } from '../../../models/response.model';
import { FilterUtil } from '../../../infrastructure/filter.util';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { HubRoutingWardViewModel, GetDatasFromHubViewModel, HubRoutingCreateUpdateViewModel } from '../../../view-model/index';
import { HubRouting, User } from '../../../models/index';
import { KeyCodeUtil } from '../../../infrastructure/keyCode.util';
import { ListStreetJoinByWard } from '../../../models/listStreetJoinByWard.model';
import { StreetJoin } from '../../../models/streetJoin.model';
import { StreetJoinByWard } from '../../../models/streetJoinByWard.model';
import { Router } from '@angular/router';
import { SelectModel } from '../../../models/select.model';
import { SortUtil } from '../../../infrastructure/sort.util';
import { PersistenceService } from 'angular-persistence';
import { Table } from 'primeng/table';
import { environment } from '../../../../environments/environment';

declare var jQuery: any;

@Component({
  selector: 'app-hub-routing-management',
  templateUrl: 'hub-routing-management.component.html',
  styles: []
})
export class HubRoutingManagementComponent extends BaseComponent implements OnInit {
  changeHubName = environment.hub;

  constructor(private modalService: BsModalService, private hubService: HubService,
    protected messageService: MessageService, private hubRoutingService: HubRoutingService,
    private userService: UserService, public permissionService: PermissionService, public router: Router,
    private authService: AuthService
  ) {
    super(messageService, permissionService, router);
  }

  @ViewChild("dt") dt: Table;

  parentPage: string = Constant.pages.generalLocation.name;
  currentPage: string = Constant.pages.generalHub.childrens.hubRoutingManagement.name;
  modalTitle: string;
  bsModalRef: BsModalRef;
  displayDialog: boolean;
  data: HubRouting;
  selectedData: HubRouting;
  isNew: boolean;
  listData: HubRouting[];
  lazyLoadEvent: LazyLoadEvent;
  //
  cols = [
    { field: 'code', header: 'Mã', hidden: false },
    { field: 'name', header: 'Tên', hidden: false },
    { field: 'hub.id', header: 'ID '+this.changeHubName.stationHubLongName+'', hidden: true },
    { field: 'hub.name', header: 'Tên '+this.changeHubName.stationHubLongName+'', hidden: false },
    { field: 'user.fullName', header: 'Tên nhân viên', hidden: false }
  ];

  columns: string[] = ["code", "name"];
  datasource: HubRouting[] = [];
  totalRecords: number;
  rowPerPage: number = 10;
  //
  centerHubs: SelectModel[] = [];
  selectedCenterHub: number;
  //
  poHubs: SelectModel[] = [];
  selectedPoHub: number;
  //
  hubs: SelectModel[] = [];
  selectedHub: number;
  //
  stationHubs: SelectModel[] = [];
  selectedStationHub: number;
  //
  riders: SelectModel[];
  selectedRider: number;
  //
  hubRoutingWards: HubRoutingWardViewModel[];
  selectedHubRoutingWards: HubRoutingWardViewModel[];
  //
  listStreetJoinByWard: ListStreetJoinByWard;
  hubRoutingStreet: StreetJoinByWard[];
  selectedHubRoutingStreets: StreetJoinByWard[] = [];

  currentUser: User;
  isEnableRider: boolean = false;
  riderName = "";
  //
  @ViewChild('filterGb') filterGb: ElementRef;

  ngOnInit() {
    this.initData();
  }

  async initData() {
    // this.hubService.getCenterHub().subscribe(x => {
    //   if (!super.isValidResponse(x)) return;
    //   // this.centerHubs = x.data as Hub[];
    //   this.selectedCenterHub = 0;
    // });

    this.centerHubs = await this.hubService.getSelectModelCenterHubAsync();

    // this.userService.getEmpByCurrentHub().subscribe(
    //   x => {
    //     this.riders = [];
    //     let riders = x.data as User[];
    //     if (!riders) return;

    //     riders.forEach(element => {
    //       this.riders.push(element);
    //     });
    //   }
    // );

    this.riders = await this.userService.getSelectModelEmpByCurrentHubAsync();

    this.filterGb.nativeElement.value = null;
    this.data = null;
    this.selectedData = null;
    this.isNew = true;

    this.currentUser = await this.userService.getAsync(this.authService.getUserId());
  }

  async loadHubRouting() {
    if (!this.selectedPoHub) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa chọn chi nhánh" });
      return;
    }

    this.hubRoutingService.getHubRoutingByPoHubId(this.selectedPoHub).subscribe(
      x => {
        if (!super.isValidResponse(x)) return;
        this.listData = this.datasource = x.data as HubRouting[];
        // this.totalRecords = this.datasource.length;
        // this.listData = this.datasource.slice(0, this.rowPerPage);
      }
    );
  }

  clearStationHubData() {
    this.datasource = null;
    this.data = null;
    this.selectedData = null;
    this.totalRecords = 0;
    this.listData = null;
    this.selectedHub = null;
    this.dt.filter(null, 'hub.id', 'equals')
    // this.dt.value = null;

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

  async openModel(template: TemplateRef<any>, data: HubRouting = null) {
    if (data) {

      this.modalTitle = "Xem chi tiết";
      this.isNew = false;
      this.data = this.clone(data);
      this.selectedData = data;
      this.selectedStationHub = this.data.hubId;

      await this.loadDatasFromHub(this.selectedData.id);
      this.onViewStreet(this.selectedHubRoutingWards);
    } else {
      this.modalTitle = "Tạo mới";
      this.isNew = true;
      this.data = new HubRouting();
      this.selectedStationHub = 0;
      this.selectedRider = 0;
      this.hubRoutingWards = [];
      this.selectedHubRoutingWards = [];
      this.hubRoutingStreet = [];
      this.isEnableRider = true;
    }

    if (this.currentUser.hubId == this.selectedCenterHub || this.currentUser.hubId == this.selectedStationHub || this.currentUser.id == 1) {
      this.selectedRider = data ? data.userId : 0;
      this.isEnableRider = true;
    }
    else {
      if (data && data.user) {
        this.riderName = data.user.code + " - " + data.user.fullName;
      }
      else {
        this.riderName = "";
      }
      this.isEnableRider = false;
    }

    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-lg' });
  }

  openDeleteModel(template: TemplateRef<any>, data: HubRouting) {
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
    this.lazyLoadEvent = event;

    setTimeout(() => {
      if (this.datasource) {
        var filterRows;

        //filter
        if (event.filters.length > 0)
          filterRows = this.datasource.filter(x => FilterUtil.filterField(x, event.filters));
        else
          filterRows = this.datasource.filter(x => FilterUtil.gbFilterFiled(x, event.globalFilter, this.columns));

        if (this.selectedHub) {
          //
          filterRows = filterRows.filter(x => x.hub.id == this.selectedHub);
        }

        // sort data
        // filterRows = SortUtil.sortAlphanumerical(filterRows, "name");
        filterRows.sort((a, b) => FilterUtil.compareField(a, b, event.sortField) * event.sortOrder);
        this.listData = filterRows.slice(event.first, (event.first + event.rows));
        this.totalRecords = filterRows.length;

        // this.listData = filterRows.slice(event.first, (event.first + event.rows));
      }
    }, 250);
  }

  refresh() {
    this.loadHubRouting();
    this.filterGb.nativeElement.value = null;
  }

  isValid(): boolean {
    let isSuccess = true;
    let messages: Message[] = [];

    if (!this.data.code) {
      messages.push({ severity: Constant.messageStatus.warn, detail: "Chưa nhập mã" });
      isSuccess = false;
    }

    if (!this.data.name) {
      messages.push({ severity: Constant.messageStatus.warn, detail: "Chưa nhập tên" });
      isSuccess = false;
    }

    if (!this.selectedStationHub) {
      messages.push({ severity: Constant.messageStatus.warn, detail: "Chưa chọn trạm" });
      isSuccess = false;
    } else if (!this.selectedStationHub) {
      messages.push({ severity: Constant.messageStatus.warn, detail: "Chưa chọn trạm" });
      isSuccess = false;
    }

    if (this.selectedHubRoutingWards.length === 0) {
      messages.push({ severity: Constant.messageStatus.warn, detail: "Chưa chọn phường xã" });
      isSuccess = false;
    }

    if (!isSuccess) {
      this.messageService.addAll(messages);
    }

    return isSuccess;
  }

  save() {
    if (!this.isValid()) return;

    let list = [...this.listData];
    let wards = [];
    let model = new HubRoutingCreateUpdateViewModel();

    model.streetJoinIds = [];

    this.selectedHubRoutingWards.forEach(x => wards.push(x.wardId));
    model.code = this.data.code;
    model.concurrencyStamp = this.data.concurrencyStamp;
    model.hubId = this.selectedStationHub;
    model.id = this.data.id;
    model.name = this.data.name;
    if (this.selectedRider)
      model.userId = this.selectedRider;
    else
      model.userId = null;
    model.wardIds = wards;
    if (this.selectedHubRoutingStreets.length > 0) {
      model.streetJoinIds = this.selectedHubRoutingStreets.map(x => x.id);
    }

    if (this.isNew) {
      this.hubRoutingService.create(model).subscribe(x => {
        if (!super.isValidResponse(x)) return;
        var obj = x.data as HubRouting;
        this.mapSaveData(obj);
        list.push(this.data);
        this.datasource.push(this.data);
        this.saveClient(list);
      });
    }
    else {
      this.hubRoutingService.update(model).subscribe(x => {
        if (!super.isValidResponse(x)) return;
        var obj = x.data as HubRouting;
        this.mapSaveData(obj);
        list[this.findSelectedDataIndex()] = this.data;
        this.datasource[this.datasource.indexOf(this.selectedData)] = this.data;
        this.saveClient(list);
        this.hubRoutingStreet = [];
        this.selectedHubRoutingStreets = [];
      });
    }
  }

  mapSaveData(obj: HubRouting) {
    if (obj) {
      this.data.id = obj.id;
      this.data.hub = this.stationHubs.find(x => x.value == this.selectedStationHub).data;
      this.data.user = this.riders.find(x => x.value == this.selectedRider).data;
      this.data.concurrencyStamp = obj.concurrencyStamp;
    }
  }

  delete() {
    this.hubRoutingService.delete(new BaseModel(this.data.id)).subscribe(x => {
      if (!super.isValidResponse(x)) return;

      let index = this.findSelectedDataIndex();
      this.datasource.splice(this.datasource.indexOf(this.selectedData), 1);
      this.saveClient(this.listData.filter((val, i) => i != index));
    });
  }

  saveClient(list: HubRouting[]) {
    this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Cập nhật thành công' });
    this.listData = list;
    this.data = null;
    this.selectedData = null;
    this.selectedStationHub = 0;
    this.hubRoutingWards = [];
    this.selectedHubRoutingWards = [];
    this.selectedRider = 0;
    this.bsModalRef.hide();
  }

  async changeCenterHub() {
    this.clearStationHubData();

    // this.hubService.getPoHubByCenterId(this.selectedCenterHub).subscribe(
    //   x => {
    //     if (!super.isValidResponse(x)) return;
    //     // this.poHubs = x.data as Hub[];
    //     this.selectedPoHub = new Hub();
    //   }
    // );

    this.poHubs = await this.hubService.getSelectModelPoHubByCenterIdbAsync(this.selectedCenterHub);

    this.stationHubs = [];
  }

  async changePoHub() {
    this.dt.filter(null, 'hub.id', 'equals')
    this.loadHubRouting();

    // this.hubService.getStationHubByPoId(this.selectedPoHub.id).subscribe(
    //   x => {
    //     if (!super.isValidResponse(x)) return;

    //     let data = x.data as Hub[];

    //     let hub = new Hub();
    //     hub.name = "--- Chọn tất cả ---";
    //     hub.id = null;

    //     data.unshift(hub);

    //     this.hubs = this.stationHubs = data;
    //     this.selectedHub = this.selectedStationHub = new Hub();
    //   }
    // );

    this.stationHubs = this.hubs = await this.hubService.getSelectModelAsync(this.selectedPoHub);
  }

  async loadDatasFromHub(hubRoutingId: number) {
    let x = await this.hubRoutingService.getDatasFromHubAsync(this.selectedStationHub, hubRoutingId);
    if (!super.isValidResponse(x)) return;
    let obj = x.data as GetDatasFromHubViewModel;
    this.hubRoutingWards = obj.wards;
    this.hubRoutingWards = SortUtil.sortAlphanumerical(this.hubRoutingWards, "wardName");
    this.selectedHubRoutingWards = obj.wards.filter(x => obj.selectedWardIds.indexOf(x.wardId) !== -1);
  }

  onViewStreet(selectedHubRoutingWards) {
    const selectedHubRoutingWardIds = this.selectedHubRoutingWards.map(x => x.wardId).join(",");

    if (selectedHubRoutingWardIds) {
      if (!this.selectedData) {
        this.selectedData = new HubRouting();
        this.selectedData.id = 0;
      }

      this.hubRoutingService.getDataStreetJoinByWard(this.selectedStationHub, this.selectedData.id, selectedHubRoutingWardIds).subscribe(
        x => {
          if (!super.isValidResponse(x)) return;
          this.listStreetJoinByWard = x.data as ListStreetJoinByWard;
          const selectedStreetIds = this.listStreetJoinByWard.selectedStreetIds;
          this.selectedHubRoutingStreets = [];
          this.hubRoutingStreet = this.listStreetJoinByWard.streets;
          if (selectedStreetIds) {
            if (selectedStreetIds.length > 0) {
              selectedStreetIds.forEach(x => {
                this.hubRoutingStreet.forEach(e => {
                  if (e.streetId === x) {
                    this.selectedHubRoutingStreets.push(e);
                  }
                })
              });
            }
          }
        }
      );
    }
  }

  changeStationHub() {
    this.loadDatasFromHub(0);

    if (this.currentUser.hubId == this.selectedCenterHub || this.currentUser.hubId == this.selectedStationHub || this.currentUser.id == 1) {
      this.isEnableRider = true;
    }
    else {
      this.isEnableRider = false;
    }
  }

  clone(model: HubRouting): HubRouting {
    let data = new HubRouting();
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
