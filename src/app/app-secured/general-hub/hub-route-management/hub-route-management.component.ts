import { Component, OnInit } from '@angular/core';
//
import { Constant } from '../../../infrastructure/constant';
import { District, Province, Ward } from '../../../models';
import { HubService, DistrictService, ProvinceService, WardService, HubRouteService, PermissionService } from '../../../services';
import { MessageService } from 'primeng/components/common/messageservice';
import { BaseComponent } from '../../../shared/components/baseComponent';
import { DataHubRouteViewModel } from '../../../view-model/index';
import { Router } from '@angular/router';
import { SelectModel } from '../../../models/select.model';
import { environment } from '../../../../environments/environment';

declare var jQuery: any;

@Component({
  selector: 'app-hub-route-management',
  templateUrl: 'hub-route-management.component.html',
  styles: []
})
export class HubRouteManagementComponent extends BaseComponent implements OnInit {
  changeHubName = environment.hub;

  constructor(protected messageService: MessageService,
    private hubService: HubService, private provinceService: ProvinceService, private districtService: DistrictService,
    private wardService: WardService, private hubRouteService: HubRouteService,
    public permissionService: PermissionService, public router: Router
  ) {
    super(messageService, permissionService, router);
  }

  parentPage: string = Constant.pages.generalHub.name;
  currentPage: string = Constant.pages.generalHub.childrens.hubRouteManagement.name;
  centerHubs: SelectModel[] = [];
  selectedCenterHub: number;
  //
  poHubs: SelectModel[] = [];
  selectedPoHub: number;
  //
  stationHubs: SelectModel[] = [];
  selectedStationHub: number;
  //
  hubs: SelectModel[] = [];
  selectedHub: number;
  //
  provinces: Province[] = [];
  selectedProvinces: Province[] = [];
  //
  districts: District[] = [];
  selectedDistricts: District[] = [];
  //
  wards: Ward[] = [];
  selectedWards: Ward[] = [];

  colsProvince = [
    { field: 'name', header: 'Tỉnh thành' },
  ];

  colsDistrict = [
    { field: 'name', header: 'Quận huyện' },
    { field: 'province.name', header: 'Tỉnh thành' },
  ];

  colsWard = [
    { field: 'name', header: 'Phường xã' },
    { field: 'district.name', header: 'Quận huyện' },
    { field: 'district.province.name', header: 'Tỉnh thành' }
  ];

  ngOnInit() {
    this.initData();
  }

  async initData() {
    this.centerHubs = await this.hubService.getSelectModelCenterHubAsync();
    this.provinces = await this.provinceService.getAllAsync()
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

  clearDataHubRoute() {
    this.selectedProvinces = [];
    this.selectedDistricts = [];
    this.districts = [];
    this.selectedWards = [];
    this.wards = [];
  }

  async changeCenterHub() {
     this.clearDataHubRoute();
    this.poHubs = await this.hubService.getSelectModelPoHubByCenterIdbAsync(this.selectedCenterHub);
  }

  async changePoHub() {
    this.clearDataHubRoute();
    this.stationHubs = this.hubs = await this.hubService.getSelectModelAsync(this.selectedPoHub);

  }

  async changeStationHub() {
    this.clearDataHubRoute();
    console.log(this.selectedStationHub);

    this.hubRouteService.getDatasFromHub(this.selectedStationHub).subscribe(
      x => {
        if (!super.isValidResponse(x)) return;

        let dataHubRoute = x.data as DataHubRouteViewModel;
        if (dataHubRoute !== null) {
          this.selectedProvinces = this.provinces.filter(r => dataHubRoute.selectedProvinceCiyIds.indexOf(r.id) !== -1);
          dataHubRoute.districts.forEach(x => x.province = this.selectedProvinces.filter(p => p.id === x.provinceId)[0]);
          this.districts = dataHubRoute.districts;
          this.selectedDistricts = this.districts.filter(r => dataHubRoute.selectedDistrictIds.indexOf(r.id) !== -1);

          let cols = [
            Constant.classes.includes.ward.district
          ];

          let districtIds = this.selectedDistricts.map(x => x.id);
          this.wardService.getWardByDistrictIds(districtIds, false, cols).subscribe(res => {
            this.wards = res.data as Ward[];
            this.wards.map(ward => ward.district.province = this.provinces.filter(pro => pro.id == ward.district.provinceId)[0]);

            let wardIds = this.wards.map(x => x.id);
            this.hubRouteService.GetHubRouteByWardIds(wardIds,this.selectedStationHub).subscribe(res => {
              let data = res.data as any[];

              this.wards.map(ward => {
                let find = data.find(hub => hub.wardId == ward.id);
                if (find) {
                  ward["isDisabled"] = true;
                  ward["hubName"] = find["name"];
                }
              })

              dataHubRoute.wards.forEach(x => x.district = this.selectedDistricts.filter(p => p.id === x.districtId)[0]);

              setTimeout(() => {
                this.selectedWards = dataHubRoute.wards;
              }, 0);
            });
          })
        }
      }
    );
  }

  async clickSelectProvinces() {
    if (!this.selectedStationHub) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa chọn trạm" });
      return;
    }
    if (this.selectedProvinces.length === 0) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Vui lòng chọn tỉnh thành" });
      return;
    }

    let ids: number[] = [];
    this.selectedProvinces.forEach(x => ids.push(x.id));
    const districts = await this.districtService.getDistrictByProvinceIdsAsync(ids);
    if (districts) {
      this.districts = districts as District[];
      this.districts.forEach(
        x => {
          x.province = this.selectedProvinces.filter(dest => dest.id === x.provinceId)[0];
        }
      );

    }
    setTimeout(() => {
      this.selectedDistricts = this.selectedDistricts.filter(dist => this.selectedProvinces.find(pro => pro.id == dist.provinceId));
      this.selectedWards = this.selectedWards.filter(ward => this.selectedDistricts.find(dist => dist.id == ward.districtId && dist.provinceId == ward.district.provinceId));
      this.wards = this.wards.filter(ward => this.selectedProvinces.find(pro => pro.id == ward.district.provinceId) && this.selectedDistricts.find(dist => dist.id == ward.districtId));
    }, 0);
  }

  async clickSelectDistricts() {
    if (!this.selectedStationHub) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa chọn trạm" });
      return;
    }
    if (this.selectedDistricts.length === 0) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Vui lòng chọn quận huyện" });
      return;
    }

    let ids: number[] = [];
    this.selectedDistricts.forEach(x => ids.push(x.id));
    const wards = await this.wardService.getWardByDistrictIdsAsync(ids, true);
    if (wards) {
      this.wards = wards as Ward[];
      this.wards.forEach(
        x => {
          x.district = this.selectedDistricts.filter(dest => dest.id === x.districtId)[0];
        }
      );
  
      let wardIds = this.wards.map(x => x.id);
      const data = await this.hubRouteService.getHubRouteByWardIdsAsync(wardIds, this.selectedStationHub);
      if (data) {
        this.wards.map(ward => {
          let find = data.find(hub => hub.wardId == ward.id);
          if (find) {
            ward["isDisabled"] = true;
            ward["hubName"] = find["name"];
          }
        })
  
        setTimeout(() => {
          this.selectedWards = this.selectedWards.filter(ward => this.selectedDistricts.find(dist => dist.id == ward.districtId && dist.provinceId == ward.district.provinceId));
          this.wards = this.wards.filter(ward => this.selectedProvinces.find(pro => pro.id == ward.district.provinceId) && this.selectedDistricts.find(dist => dist.id == ward.districtId));
        }, 0);
      }
    }
  }

  clickSaveChange() {
    if (!this.selectedStationHub) {
      this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Chưa chọn trạm" });
      return;
    }

    let wardIds = [];
    this.selectedWards.forEach(x => wardIds.push(x.id));
    this.hubRouteService.saveChangeHubRoute(this.selectedStationHub, wardIds).subscribe(
      x => {
        if (!super.isValidResponse(x)) return;
        this.messageService.add({ severity: Constant.messageStatus.success, detail: "Cập nhật thành công" });
      }
    );
  }
}
