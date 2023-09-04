import { Component, OnInit } from '@angular/core';
import 'jquery-slimscroll';

declare var jQuery:any;

@Component({
  selector: 'app-right-sidebar',
  templateUrl: 'right-sidebar.component.html',
  styles: []
})
export class RightSidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('.right-sidebar-toggle').on('click', function () {
      jQuery('#right-sidebar').toggleClass('sidebar-open');
    });

    jQuery('.sidebar-container').slimScroll({
      height: '100%',
      railOpacity: 0.4,
      wheelStep: 10
    });
  }
}
