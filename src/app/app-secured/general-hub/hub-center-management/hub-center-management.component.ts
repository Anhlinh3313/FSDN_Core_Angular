import { Component, OnInit, TemplateRef, NgZone, ElementRef, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
//
import { Constant } from '../../../infrastructure/constant';
import { Hub, District, Province, Ward } from '../../../models';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { BaseModel } from '../../../models/base.model';
import { HubService, DistrictService, ProvinceService, WardService, PermissionService } from '../../../services';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/message';
import { ResponseModel } from '../../../models/response.model';
import { FilterUtil } from '../../../infrastructure/filter.util';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { GMapHelper } from '../../../infrastructure/gMap.helper';
import { MapsAPILoader } from '@agm/core';
import { KeyCodeUtil } from '../../../infrastructure/keyCode.util';
import { Router } from '@angular/router';
import { GeocodingApiService } from '../../../services/geocodingApiService.service';
import { SortUtil } from '../../../infrastructure/sort.util';
import { SelectModel } from '../../../models/select.model';
import { Table } from 'primeng/table';
import { environment } from '../../../../environments/environment';

declare var jQuery: any;

@Component({
  selector: 'app-hub-center-management',
  templateUrl: 'hub-center-management.component.html',
  styles: []
})
export class HubCenterManagementComponent extends BaseComponent implements OnInit {
  changeHubName = environment.hub;

  constructor(private modalService: BsModalService, protected messageService: MessageService,
    private hubService: HubService, private provinceService: ProvinceService, private districtService: DistrictService,
    private wardService: WardService,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    public permissionService: PermissionService, public router: Router,
    private geocodingApiService: GeocodingApiService
  ) {
    super(messageService, permissionService, router);
  }


  parentPage: string = Constant.pages.generalHub.name;
  currentPage: string = Constant.pages.generalHub.childrens.hubCenterManagement.name;
  modalTitle: string;
  bsModalRef: BsModalRef;
  displayDialog: boolean;
  data: Hub;
  isNew: boolean;
  listData: Hub[];
  selectedData: Hub;
  //
  columns: string[] = ["code", "name", "phoneNumber", "email", "fax", "district.name", "ward.name"];
  datasource: Hub[];
  totalRecords: number;
  rowPerPage: number = 10;
  //
  districts: SelectModel[] = [];
  selectedDistrict: number;
  //
  provinces: SelectModel[] = [];
  selectedProvince: number;
  //
  wards: SelectModel[] = [];
  selectedWard: number;
  //
  cloneWardName: string;
  cloneDistrictName: string;
  cloneProviceName: string;
  //
  colsTable = [
    { field: 'code', header: 'Mã' },
    { field: 'name', header: 'Tên' },
    { field: 'phoneNumber', header: 'Số điện thoại' },
    { field: 'email', header: 'Email' },
    { field: 'fax', header: 'Fax' },
    { field: 'district.name', header: 'Quận huyện' },
    { field: 'ward.name', header: 'Phường xã' },
  ]
  //
  @ViewChild('filterGb') filterGb: ElementRef;

  ngOnInit() {
    this.initData();
    this.loadProvinces(true);
  }

  async initData() {
    let includes = [];
    includes.push(Constant.classes.includes.hub.centerHub);
    includes.push(Constant.classes.includes.hub.province);
    includes.push(Constant.classes.includes.hub.district);
    includes.push(Constant.classes.includes.hub.poHub);
    includes.push(Constant.classes.includes.hub.ward);

    const hubs = await this.hubService.getCenterHubAsync(includes);
    if (hubs) {
      this.datasource = hubs as Hub[];
      this.totalRecords = this.datasource.length;
      this.listData = this.datasource;
    }

    this.filterGb.nativeElement.value = null;
    this.data = null;
    this.isNew = true;
  }

  async loadProvinces(isNew: boolean) {
    // const data = await this.provinceService.getAllAsync();
    // if (data) {
    //   this.provinces = data as Province[];
    //   const provinces = data as Province[];
    //   if (provinces.length > 0 && isNew) {
    //     this.selectedProvince = provinces[0];
    //     this.loadDistricts(true);
    //   }
    // }
    this.provinces = await this.provinceService.getSelectModelAllAsync();
    if (this.provinces.length > 0 && isNew) {
      this.selectedProvince = this.provinces[0].value;
      this.loadDistricts(true);
    }
  }

  async loadDistricts(isNew: boolean) {
    // const data = await this.districtService.getDistrictByProvinceIdAsync(this.selectedProvince.id);
    // if (data) {
    //   const districts = data as District[];

    //   if (districts.length > 0 && isNew) {
    //     this.selectedDistrict = districts[0];
    //     this.loadWards(true);
    //   }

    //   this.districts = districts;
    // }
    this.districts = await this.districtService.getSelectModelDistrictByProvinceIdAsync(this.selectedProvince);
    if (this.districts.length > 0 && isNew) {
      this.selectedDistrict = this.districts[0].value;
      this.loadWards(true);
    }
  }

  async loadWards(isNew: boolean) {
    // const data = await this.wardService.getWardByDistrictIdAsync(this.selectedDistrict.id);
    // if (data) {
    //   const wards = data as Ward[];

    //   if (wards.length > 0 && isNew) {
    //     this.selectedWard = wards[0];
    //   }
    //   this.wards = wards;
    // }
    this.wards = await this.wardService.getSelectModelWardByDistrictIdAsync(this.selectedDistrict);
    if (this.wards.length > 0 && isNew) {
      this.selectedWard = this.wards[0].value;
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

  public setAddress(place: google.maps.places.PlaceResult) {
    if (!place.geometry || !place.geometry) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Không tìm thấy địa chỉ" });
      return;
    }

    this.loadLocationPlace(place);
    this.data.address = place.formatted_address;
    this.data.lat = place.geometry.location.lat();
    this.data.lng = place.geometry.location.lng();
  }

  async loadLocationPlace(place: google.maps.places.PlaceResult) {
    let provinceName = "";
    let districtName = "";
    let wardName = "";

    let isProvince: boolean;
    let isDistrict: boolean;
    let isWard: boolean;

    place = await this.geocodingApiService.findFirstFromLatLngAsync(
      place.geometry.location.lat(),
      place.geometry.location.lng()
    ) as google.maps.places.PlaceResult;

    // console.log(place);

    place.address_components.forEach(element => {
      if (element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_1) !== -1) {
        isProvince = true;
        provinceName = element.long_name;
      }
      else if (element.types.indexOf(GMapHelper.LOCALITY) !== -1 || element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_2) !== -1) {
        isDistrict = true;
        districtName = element.long_name;
      }
      else if (element.types.indexOf(GMapHelper.SUBLOCALITY_LEVEL_1) !== -1 || element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_3) !== -1) {
        isWard = true;
        wardName = element.long_name;
      }
    });
    this.cloneProviceName = provinceName;
    this.cloneDistrictName = districtName;
    this.cloneWardName = wardName;
    this.provinceService.getProvinceByName(provinceName).subscribe(
      x => {
        if (!super.isValidResponse(x)) return;
        let province = x.data as Province;
        if (!province) {
          this.selectedProvince = null;
          return;
        }
        this.selectedProvince = province.id;
        this.selectedDistrict = null;
        this.loadProvinces(false);
        this.loadDistricts(true);
        this.districtService.getDistrictByName(districtName, this.selectedProvince).subscribe(
          x => {
            if (!this.cloneDistrictName) {
              this.districts = [];
              this.wards = [];
              this.messageService.add({
                severity: Constant.messageStatus.warn,
                detail: "Vui lòng chọn Quận/huyện gửi!"
              });
              this.messageService.add({
                severity: Constant.messageStatus.warn,
                detail: "Vui lòng chọn Phường/xã gửi!"
              });
            } else {
              if (!super.isValidResponse(x)) return;
              let district = x.data as District;
              if (!district) {
                this.selectedDistrict = null;
                return;
              }
              this.selectedDistrict = district.id;
              this.selectedWard = null;

              this.loadDistricts(false);
              this.loadWards(true);
              this.wardService.getWardByName(wardName, this.selectedDistrict).subscribe(
                x => {
                  if (!this.cloneWardName) {
                    this.wards = [];
                    this.messageService.add({
                      severity: Constant.messageStatus.warn,
                      detail: "Vui lòng chọn Phường/xã gửi!"
                    });
                  } else {
                    if (!super.isValidResponse(x)) return;
                    let ward = x.data as Ward;

                    if (!ward) {
                      this.selectedWard = null;
                      return;
                    }
                    this.selectedWard = ward.id;
                    this.loadWards(false);
                  }
                } //End wardService
              );
            }
          } //End districtService
        );
      } //End provinceService
    );
  }

  openModel(template: TemplateRef<any>, data: Hub = null) {
    if (data) {
      this.modalTitle = "Xem chi tiết";
      this.isNew = false;
      this.data = this.clone(data);
      this.selectedData = data;
      // this.selectedProvince = this.provinces.filter(x => x.id == this.data.district.provinceId)[0];
      this.selectedProvince = this.data.district.provinceId;
      this.selectedDistrict = this.data.districtId;
      this.selectedWard = this.data.wardId;
      this.loadDistricts(false);
      this.loadWards(false);
    } else {
      this.modalTitle = "Tạo mới";
      this.isNew = true;
      this.data = new Hub();
      this.selectedProvince = 0;
      this.districts = null;
      this.wards = null;
    }
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }

  openDeleteModel(template: TemplateRef<any>, data: Hub) {
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

  refresh(dt: Table) {
    dt.reset();
    this.initData();
  }

  save() {
    let list = [...this.listData];
    if (this.selectedProvince) {
      this.data.provinceId = this.selectedProvince;
    }
    if (this.selectedDistrict) {
      this.data.districtId = this.selectedDistrict;
    }
    if (this.selectedWard) {
      this.data.wardId = this.selectedWard;
    }

    if (this.isNew) {
      this.hubService.create(this.data).subscribe(x => {
        if (!super.isValidResponse(x)) return;

        var obj = (x.data as Hub);
        this.mapSaveData(obj);
        list.push(this.data);
        this.datasource.push(this.data);
        this.saveClient(list);
      });
    }
    else {
      this.hubService.update(this.data).subscribe(x => {
        if (!super.isValidResponse(x)) return;

        var obj = (x.data as Hub);
        this.mapSaveData(obj);
        list[this.findSelectedDataIndex()] = this.data;
        this.datasource[this.datasource.indexOf(this.selectedData)] = this.data;
        this.saveClient(list);
      });
    }
  }

  mapSaveData(obj: Hub) {
    if (obj) {
      this.data.id = obj.id;
      this.data.concurrencyStamp = obj.concurrencyStamp;
      // this.data.province = this.selectedProvince;
      this.data.province = this.provinces.find(x => x.value == this.selectedProvince).data;
      // this.data.district = this.selectedDistrict;
      this.data.district = this.districts.find(x => x.value == this.selectedDistrict).data;
      // this.data.ward = this.selectedWard;
      this.data.ward = this.wards.find(x => x.value == this.selectedWard).data;
      // this.data.district.province = this.selectedProvince;
      this.data.district.province = this.provinces.find(x => x.value == this.selectedProvince).data;
    }
  }

  delete() {
    this.hubService.delete(new BaseModel(this.data.id)).subscribe(x => {
      if (!super.isValidResponse(x)) return;

      let index = this.findSelectedDataIndex();
      var list = this.listData.filter((val, i) => i != index);
      this.datasource.splice(this.datasource.indexOf(this.selectedData), 1);

      this.saveClient(list);
    });
  }

  saveClient(list: Hub[]) {
    this.messageService.add({ severity: Constant.messageStatus.success, detail: 'Cập nhật thành công' });
    this.listData = list;
    this.data = null;
    this.selectedData = null;
    this.selectedProvince = 0;
    this.selectedDistrict = 0;
    this.districts = null;
    this.bsModalRef.hide();
  }

  changeProvince() {
    this.loadDistricts(true);
  }

  changeDistrict() {
    this.loadWards(true);
  }

  clone(model: Hub): Hub {
    let data = new Hub();
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
