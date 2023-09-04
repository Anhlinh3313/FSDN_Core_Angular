import { Component, OnInit, TemplateRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { MessageService } from 'primeng/components/common/messageservice';
import { WardService, ProvinceService, DistrictService, PermissionService } from '../../../services';
import { Constant } from '../../../infrastructure/constant';
import { BaseComponent } from '../../../shared/components/baseComponent';
import {  StreetJoin } from '../../../models/streetJoin.model';
import { StreetJoinService } from '../../../services/streetJoin.service';
import { FilterUtil } from '../../../infrastructure/filter.util';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { KeyCodeUtil } from '../../../infrastructure/keyCode.util';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { GeocodingApiService } from '../../../services/geocodingApiService.service';
import { GMapHelper } from '../../../infrastructure/gmap.helper';
import { StreetService } from '../../../services/street.service';
import { CreateStreet } from '../../../models/createStreet.model';
import { BaseModel } from '../../../models';
import { Street } from '../../../models/street.model';
import { InputValue } from '../../../infrastructure/inputValue.helper';
import { Router } from '@angular/router';
import { SortUtil } from '../../../infrastructure/sort.util';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-street-management',
  templateUrl: './street-management.component.html',
  styles: []
})
export class StreetManagementComponent extends BaseComponent implements OnInit {
  createdStreet: any;
  event: LazyLoadEvent;
  provineces: SelectItem[];
  districts: SelectItem[];
  wards: SelectItem[];
  selectedFilterProvince: number;
  selectedFilterDistrict: number;
  selectedFilterWard: number;
  wardCode: string;
  isDuplicateStreet: boolean;
  createStreetModel: CreateStreet = new CreateStreet();
  streetId: string = "streetId";
  longitudeTo: number;
  latitudeTo: number;
  longitudeFrom: number;
  latitudeFrom: number;
  zoom: number;
  @ViewChild("searchStreet") public searchStreetElementRef: ElementRef;
  searchStreetControl: FormControl = new FormControl();
  txtAddress: string;
  streetName: string;
  streetCode: string;
  selectedProvince: string;
  selectedDistrict: string;
  selectedWard: string;
  includes: any[];
  selectedData: StreetJoin;
  isNew: boolean;
  data: StreetJoin;
  //
  colsStreet = [
    { field: 'code', header: 'Mã' },
    { field: 'name', header: 'Tên' },
    { field: 'province.name', header: 'Tỉnh thành' },
    { field: 'district.name', header: 'Quận huyện' },
    { field: 'ward.name', header: 'Phường Xã' },
  ]
  //
  columns: string[] = ["street.code", "street.name","province.name", "district.name", "ward.name"];
  listData: StreetJoin[];
  totalRecords: number;
  datasource: StreetJoin[];
  rowPerPage: number = 10;
  bsModalRef: BsModalRef;
  bsModalRefCreate: BsModalRef;

  constructor(private modalService: BsModalService, protected messageService: MessageService,
    private wardService: WardService, private provinceService: ProvinceService, private districtService: DistrictService,
        private streetJoinService: StreetJoinService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
        private streetService: StreetService, private geocodingApiService: GeocodingApiService, public permissionService: PermissionService, public router: Router) {
      super(messageService, permissionService, router);
     }

  parentPage: string = Constant.pages.generalLocation.name;
  currentPage: string = Constant.pages.generalLocation.childrens.streetManagement.name;
  modalTitle: string;

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.includes = [];
    this.includes.push(Constant.classes.includes.Street.province);
    this.includes.push(Constant.classes.includes.Street.district);
    this.includes.push(Constant.classes.includes.Street.ward);
    this.includes.push(Constant.classes.includes.Street.street);
    this.loadStreetJoin();
  }

  initMap() {
    this.zoom = 4;
    this.mapsAPILoader.load().then(() => {
      let streetAutocomplete = new google.maps.places.Autocomplete(
        <HTMLInputElement>document.getElementById("streetId"),
        {
          // types: ["address"]
        }
      );
      streetAutocomplete.addListener("place_changed", () => {
        this.ngZone.run(async () => {
          //get the place result
          let place: google.maps.places.PlaceResult = streetAutocomplete.getPlace();

          //verify result
          if (!place.geometry) {
            place = await this.geocodingApiService.findFromAddressAsync(place.name);

            if (!place) {
              this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Không tìm thấy địa chỉ" });
              return;
            }
          }
          this.loadLocationStreetPlace(place);
          this.zoom = 16;
        });
      });
    });
  }

  async loadLocationStreetPlace(place: google.maps.places.PlaceResult) {
    let provinceName = "";
    let districtName = "";
    let wardName = "";
    let streetName = "";

    place = await this.geocodingApiService.findFirstFromLatLngAsync(
      place.geometry.location.lat(),
      place.geometry.location.lng()
    ) as google.maps.places.PlaceResult;

    if (place) {
      place.address_components.forEach(element => {
        if (
          element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_1) !== -1
        ) {
          provinceName = element.long_name;
        } else if (
          element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_2) !== -1
        ) {
          districtName = element.long_name;
        }
        else if (element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_3) !== -1) {
          wardName = element.long_name;
        }
        else if (element.types.indexOf(GMapHelper.SUBLOCALITY_LEVEL_1) !== -1) {
          wardName = element.long_name;
        }
        else if (element.types.indexOf(GMapHelper.ROUTE) !== -1) {
          streetName = element.long_name;
        }
      });
      //
      const province = await this.provinceService.getProvinceByNameAsync(provinceName);
      if (province) {
        this.selectedProvince = province.name;
        this.createStreetModel.provinceId = province.id;
        const district = await this.districtService.getDistrictByNameAsync(districtName, province.id);
        if (district) {
          this.selectedDistrict = district.name;
          this.createStreetModel.districtId = district.id;
          const ward = await this.wardService.getWardByNameAsync(wardName, district.id);
          if (ward) {
            this.selectedWard = ward.name;
            this.createStreetModel.wardId = ward.id;
            this.wardCode = ward.code;
          }
        }
      }
      this.checkDuplicateStreet(streetName);
    }
  }

  async checkDuplicateStreet(streetName: string) {
    const street = await this.streetService.getStreetByNameAsync(streetName);
    if (street) {
      this.isDuplicateStreet = true;
      this.createdStreet = street[0];
      this.streetName = this.createdStreet.name;
      this.streetCode = InputValue.removeCharactersVI(this.streetName);
      this.createStreetModel.name = this.createdStreet.name;
    } else {
      this.isDuplicateStreet = false;
      this.streetName = streetName;
      this.streetCode = InputValue.removeCharactersVI(streetName);
      this.createStreetModel.name = this.streetName;
    }
  }

  loadStreetJoin() {
    this.streetJoinService.getAll(this.includes).subscribe(x => {
      if (x.data) {
        this.datasource = x.data as StreetJoin[];
        // sort by street.name
        this.datasource = SortUtil.sortAlphanumerical(this.datasource, "street", "name");
        this.totalRecords = this.datasource.length;
        this.listData = this.datasource;
        this.loadFilter();
      }
    });
  }

  loadLazy(event: LazyLoadEvent) {
    this.event = event;
    setTimeout(() => {
      if (this.datasource) {
        var filterRows;

        //filter
        if (event.filters.length > 0)
          filterRows = this.datasource.filter(x => FilterUtil.filterField(x, event.filters));
        else
          filterRows = this.datasource.filter(x => FilterUtil.gbFilterFiled(x, event.globalFilter, this.columns));

        //Begin Custom filter
        if (this.selectedFilterProvince) {
          filterRows = filterRows.filter(x => x.provinceId === this.selectedFilterProvince);
        }
        if (this.selectedFilterDistrict) {
          filterRows = filterRows.filter(x => x.districtId === this.selectedFilterDistrict);
        }
        if (this.selectedFilterWard) {
          filterRows = filterRows.filter(x => x.wardId === this.selectedFilterWard);
        }
        //End Custom filter

        // sort data
        // filterRows = SortUtil.sortAlphanumerical(filterRows, "street", "name");
        filterRows.sort((a, b) => FilterUtil.compareField(a, b, event.sortField) * event.sortOrder);
        this.listData = filterRows.slice(event.first, (event.first + event.rows));
        this.totalRecords = filterRows.length;

        // this.listData = filterRows.slice(event.first, (event.first + event.rows));
      }
    }, 250);
  }
  
  loadFilter() {
    this.selectedFilterProvince = null;
    let uniqueProvince = [];
    this.provineces = [];
    //
    this.selectedFilterDistrict = null;
    let uniqueDistrict = [];
    this.districts = [];
    //
    this.selectedFilterWard = null;
    let uniqueWard = [];
    this.wards = [];
    //
    const firstSelect: any = { label: "Chọn tất cả", value: null };
    this.datasource.forEach(x => {
      if (uniqueProvince.length === 0) {
        this.provineces.push(firstSelect);
      }
      //
      if (uniqueProvince.indexOf(x.provinceId) === -1 && x.provinceId) {
        uniqueProvince.push(x.provinceId);
        this.provineces.push({ label: x.province.name, value: x.provinceId });
      }
      this.provineces.shift();
      this.provineces = SortUtil.sortAlphanumerical(this.provineces, "label");
      this.provineces.unshift(firstSelect);
      //
      if (uniqueDistrict.length === 0) {
        this.districts.push(firstSelect);
      }
      if (uniqueDistrict.indexOf(x.districtId) === -1 && x.districtId) {
        uniqueDistrict.push(x.districtId);
        this.districts.push({ label: x.district.name, value: x.districtId });
      }
      this.districts.shift();
      this.districts = SortUtil.sortAlphanumerical(this.districts, "label");
      this.districts.unshift(firstSelect);
      //
      if (uniqueWard.length === 0) {
        this.wards.push(firstSelect);
      }
      if (uniqueWard.indexOf(x.wardId) === -1 && x.wardId) {
        uniqueWard.push(x.wardId);
        this.wards.push({ label: x.ward.name, value: x.wardId });
      }
      this.wards.shift();
      this.wards = SortUtil.sortAlphanumerical(this.wards, "label");
      this.wards.unshift(firstSelect);
    });
  }

  changeFilter() {
    this.loadLazy(this.event);
  }

  openModel(template: TemplateRef<any>, data?: StreetJoin) {
    this.resetInput();
    this.isDuplicateStreet = null;
    if (data) {
      this.modalTitle = "Xem chi tiết";
      this.isNew = false;
      // this.data = this.clone(data);
      if (data.street) {
        this.selectedData = data;
        this.txtAddress = data.street.name;
        this.streetName = data.street.name;
        this.streetCode = data.street.code;
        this.createStreetModel.name =  data.street.name;
        this.createStreetModel.code =  data.street.code;
        this.createStreetModel.provinceId =  data.provinceId;
        this.createStreetModel.districtId =  data.districtId;
        this.createStreetModel.wardId =  data.wardId;
        if (data.province) {
          this.selectedProvince = data.province.name;
        }
        if (data.district) {
          this.selectedDistrict = data.district.name;
        }
        if (data.ward) {
          this.selectedWard = data.ward.name;
          this.wardCode = data.ward.code;
        }
        // this.checkDuplicateStreet(data.street.name);
      }
      this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
    } else {
      this.modalTitle = "Tạo mới";
      this.isNew = true;
      this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
      setTimeout(() => {
        this.initMap();
      }, 1000);
    }
  }

  resetInput() {
    this.txtAddress = null;
    this.streetName = null;
    this.streetCode = null;
    this.selectedProvince = null;
    this.selectedDistrict = null;
    this.selectedWard = null;
    this.createStreetModel = new CreateStreet();
  }

  openDeleteModel(template: TemplateRef<any>, data: StreetJoin) {
    this.selectedData = data;
    this.bsModalRef = this.modalService.show(template, { class: 'inmodal animated bounceInRight modal-s' });
  }

  async save() {
    this.createStreetModel.code = this.streetCode;

    if (!this.createStreetModel.name || this.createStreetModel.name.trim() == "") {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Chưa nhập tên đường"
      });
      return;
    }

    if (!this.createStreetModel.code || this.createStreetModel.code.trim() == "") {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Chưa nhập code"
      });
      return;
    }

    if (!this.createStreetModel.provinceId) {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Chưa có tỉnh thành"
      });
      return;
    }

    if (!this.createStreetModel.districtId) {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Chưa có quận huyện"
      });
      return;
    }

    if (!this.createStreetModel.wardId) {
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Chưa có phường xã"
      });
      return;
    }

    if (this.isNew) {
      let createStreetJoin = this.createStreetModel;
      // create street
      if (!this.isDuplicateStreet) {
        const data = await this.streetService.createAsync(this.createStreetModel);
        if (data) {
          createStreetJoin.streetId = data.id;
        }
      } else {
        createStreetJoin.streetId = this.createdStreet.id;
      }
      createStreetJoin.name = this.selectedWard + "-" + this.streetName;
      createStreetJoin.code = this.wardCode + "-" + this.streetCode;
      // create streetJoinS
      const streetJoinS = await this.streetJoinService.createAddUpdateAsync(createStreetJoin);
      if (streetJoinS) {
        this.messageService.add({
          severity: Constant.messageStatus.success,
          detail: "Phân tuyến đường thành công"
        });
        this.bsModalRef.hide();
        this.txtAddress = null;
        this.isDuplicateStreet = null;
        this.resetInput();
        this.loadStreetJoin();
      } else {
        this.messageService.add({
          severity: Constant.messageStatus.warn,
          detail: "Đã Phân tuyến đường, vui lòng chọn đường khác"
        });
      }
    } else {
      let upDateStreet: Street = new Street();
      upDateStreet = this.selectedData.street;
      upDateStreet.name = this.streetName;
      upDateStreet.code = this.streetCode;
      this.streetService.update(upDateStreet).subscribe(x => {
        if (!super.isValidResponse(x)) return;
        this.messageService.add({
          severity: Constant.messageStatus.success,
          detail: "Cập nhật thành công"
        });
        this.bsModalRef.hide();
        this.txtAddress = null;
        this.isDuplicateStreet = null;
        this.resetInput();
        this.loadStreetJoin();
      });
    }
  }

  delete() {
    this.streetJoinService.delete(new BaseModel(this.selectedData.id)).subscribe(x => {
      if (!super.isValidResponse(x)) return;
      this.messageService.add({
        severity: Constant.messageStatus.warn,
        detail: "Hủy thành công!"
      });
      this.loadStreetJoin();
      this.bsModalRef.hide();
    });
  }
  
  clone(model: StreetJoin): StreetJoin {
    let data = new StreetJoin();
    for (let prop in model) {
      data[prop] = model[prop];
    }
    return data;
  }

  refresh(dt: Table) {
    dt.reset();
    this.initData();
  }

  keyDownFunction(event) {
    if ((event.ctrlKey || event.metaKey) && event.which === KeyCodeUtil.charS) {
      this.save();
      event.preventDefault();
      return false;
    }
  }
}
