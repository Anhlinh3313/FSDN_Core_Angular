import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.component.html',
  styles: []
})
export class WelcomeComponent implements OnInit {

  constructor() { }

  public evTitle: string;
  public evName: string;
  public evCompany: string;

  ngOnInit() {
    this.evTitle = environment.title;
    this.evName = environment.name;
    this.evCompany = environment.company;
  }

}
