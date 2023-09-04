import { Component, OnInit } from '@angular/core';
import { SimpleTimer } from 'ng2-simple-timer';
import { Subscription } from 'rxjs/Subscription';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-secured',
  templateUrl: 'app-secured.component.html',
  styles: []
})
export class AppSecuredComponent implements OnInit {

  constructor(private modalService: BsModalService) { }

  timerId: string;

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
