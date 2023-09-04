import { Component, OnInit } from '@angular/core';
import 'jquery-slimscroll';

declare var jQuery:any;

@Component({
  selector: 'app-chat-box',
  templateUrl: 'chat-box.component.html',
  styles: []
})
export class ChatBoxComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('.open-small-chat').on('click', function () {
      jQuery(this).children().toggleClass('fa-comments').toggleClass('fa-remove');
      jQuery('.small-chat-box').toggleClass('active');
    });

    jQuery('.small-chat-box .content').slimScroll({
      height: '234px',
      railOpacity: 0.4
    });
  }

}
