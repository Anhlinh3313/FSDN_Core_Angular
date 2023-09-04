import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PersistenceService, StorageType } from 'angular-persistence';
import { Constant } from '../infrastructure/constant';
import { Router } from '@angular/router';
import { AuthService } from '../services/index';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class ApiEndpointInterceptor implements HttpInterceptor {
    constructor(
        private persistenceService: PersistenceService,
        private messageService: MessageService,
        private router: Router) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var token = this.persistenceService.get(Constant.auths.token, StorageType.LOCAL);
        if (req.url.startsWith("http")) {
            return next.handle(req);
        } else {
            var modReq = null;
            if (token) {
                const authHeader = "Bearer " + token;
                var updUrl = { url: environment.apiGeneralUrl + req.url, headers: req.headers.set('Authorization', authHeader) };
                modReq = req.clone(updUrl);
            } else {
                var url = { url: environment.apiGeneralUrl + req.url };
                modReq = req.clone(url);
            }

            return next.handle(modReq).do((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // do stuff with response if you want
                }
            }, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        // redirect to the login route
                        // or show a modal
                        this.persistenceService.remove(Constant.auths.isLoginIn, StorageType.LOCAL);
                        this.persistenceService.remove(Constant.auths.token, StorageType.LOCAL);
                        this.persistenceService.remove(Constant.auths.userId, StorageType.LOCAL);
                        this.persistenceService.remove(Constant.auths.userName, StorageType.LOCAL);
                        this.router.navigate([Constant.pages.login]);
                        this.messageService.add({ severity: Constant.messageStatus.warn, detail: "Hết phiên làm việc" });
                    }
                    if (err.status === 403) {
                        // redirect to the login route
                        // or show a modal
                        // console.log("403");
                        this.router.navigate([Constant.pages.page403.alias]);
                    }
                }
            });
        }
    }
}