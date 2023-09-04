export const Constant = {
    messageStatus: {
        success: "success",
        info: "info",
        warn: "warn",
        error: "error",
    },
    response: {
        isSuccess: "isSuccess",
        message: "message",
        data: "data",
        exception: "exception",
    },
    auths: {
        isLoginIn: 'crm-loggedIn',
        token: 'crm-token',
        userId: 'crm-userId',
        userName: 'crm-userName',
        currentUser: 'crm-currentUser',
        fullName: 'crm-currentUserFullName',
    },
    classes: {
        includes: {
            province: {
                country: "Country",
            },
            district: {
                province: "Province",
            },
            ward: {
                district: "District",
            },
            Street: {
                province: "Province",
                district: "District",
                ward: "Ward",
                street: "Street",
            },
            hub: {
                province: "Province",
                district: "District",
                ward: "Ward",
                centerHub: "CenterHub",
                poHub: "PoHub",
                pOHub: "POHub",
            },
            user: {
                department: "Department",
                role: "Role",
                hub: "Hub",
            }
        },
    },
    pages: {
        login: {
            name: 'Đăng nhập',
            alias: 'dang-nhap',
        },
        userGuide: {
            name: 'Hướng dẫn sử dụng',
            alias: 'user-guide',
        },
        page404: {
            name: 'Không tìm thấy trang',
            alias: '404',
        },
        page403: {
            name: 'Không có quyền truy cập',
            alias: '403',
        },
        changePassWord: {
            name: 'Thay đổi mật khẩu',
            alias: 'thay-doi-mat-khau',
        },
        general: {
            name: 'Quản lý chung',
            alias: 'quan-ly-chung',
            loadChildren: './general/general.module#GeneralModule',
            childrens: {
                roleManagement: {
                    name: 'Quản lý chức vụ',
                    alias: 'quan-ly-chuc-vu',
                },
                departmentManagement: {
                    name: 'Quản lý phòng ban',
                    alias: 'quan-ly-phong-ban',
                },
                userManagement: {
                    name: 'Quản lý tài khoản',
                    alias: 'quan-ly-tai-khoan',
                },
            }
        },
        generalSystem: {
            name: 'Quản lý hệ thống',
            alias: 'quan-ly-he-thong',
            loadChildren: './general-system/general-system.module#GeneralSystemModule',
            childrens: {
                permission: {
                    name: 'Phân quyền',
                    alias: 'phan-quyen',
                },
            }
        },
        generalHub: {
            name: 'Quản lý Hub',
            alias: 'quan-ly-hub',
            loadChildren: './general-hub/general-hub.module#GeneralHubModule',
            childrens: {
                hubCenterManagement: {
                    name: 'Quản lý vùng miền',
                    alias: 'quan-ly-trung-tam',
                },
                hubPoManagement: {
                    name: 'Quản lý chi nhánh',
                    alias: 'quan-ly-chi-nhanh',
                },
                AreaCManagement: {
                    name: 'Quản lý khu vực',
                    alias: 'quan-ly-khu-vuc',
                },
                hubStationManagement: {
                    name: 'Quản lý bưu cục',
                    alias: 'quan-ly-buu-cuc',
                },
                hubRouteManagement: {
                    name: 'Phân khu vực',
                    alias: 'phan-khu-vuc',
                },
                hubRoutingManagement: {
                    name: 'Phân tuyến',
                    alias: 'phan-tuyen',
                },
            }
        },
        generalLocation: {
            name: 'Quản lý địa danh',
            alias: 'quan-ly-dia-danh',
            loadChildren: './general-location/general-location.module#GeneralLocationModule',
            childrens: {
                countryManagement: {
                    name: 'Quản lý quốc gia',
                    alias: 'quan-ly-quoc-gia',
                },
                provinceManagement: {
                    name: 'Quản lý tỉnh thành',
                    alias: 'quan-ly-tinh-thanh',
                },
                districtManagement: {
                    name: 'Quản lý quận huyện',
                    alias: 'quan-ly-quan-huyen',
                },
                wardManagement: {
                    name: 'Quản lý phường xã',
                    alias: 'quan-ly-phuong-xa',
                },
                streetManagement: {
                    name: 'Quản lý tuyến đường',
                    alias: 'quan-ly-tuyen-duong',
                },
            },
        },
        generalMenu: {
            name: 'Quản lý Menu',
            alias: 'quan-ly-menu',
            loadChildren: './general-menu/general-menu.module#GeneralMenuModule',
            childrens: {
                menu: {
                    name: 'Thanh Menu',
                    alias: 'thanh-menu',
                },
            }
        },
        page: {
            name: 'Quản lý trang',
            alias: 'quan-ly-trang',
            loadChildren: './page/page.module#PageModule',
            childrens: {
                pageManagement: {
                    name: 'Quản lý trang',
                    alias: 'quan-ly-trang',
                }
            },
        },
        truckManagementModule: {
            name: 'Quản lý xe',
            alias: 'quan-ly-xe',
            loadChildren: './truck-management/truck-management.module#TruckManagementModule',
            childrens: {
                listTruck: {
                    name: 'Danh sách xe',
                    alias: 'danh-sach-xe',
                },
                truckType: {
                    name: 'Kiểu xe',
                    alias: 'kieu-xe',
                },
                truckOwnership: {
                    name: 'Loại xe',
                    alias: 'loai-xe',
                },
                truckRental: {
                    name: 'Đơn vị thuê xe',
                    alias: 'don-vi-thue-xe',
                },
            }
        },
        recycleBin: {
            name: 'Recycle Bin',
            alias: 'recycle-bin',
        },
    }
};
