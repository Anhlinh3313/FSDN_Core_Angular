import { Component, OnInit, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import "jquery-slimscroll";
import { MessageService } from "primeng/components/common/messageservice";
import { BaseComponent } from "../../../shared/components/baseComponent";
import { PageService, PermissionService } from "../../../services/index";
import { Page } from "../../../models/index";
import { environment } from "../../../../environments/environment";
declare var jQuery: any;

@Component({
  selector: "app-navigation",
  templateUrl: "navigation.component.html",
  styles: []
})
export class NavigationComponent extends BaseComponent implements OnInit {
  styleBackGround: string;
  isToggle: boolean = false;
  saveSelectedIndex: number;
  selectNavItemIndex: number = null;

  constructor(
    protected messageService: MessageService,
    private pageService: PageService,
    private el: ElementRef,
    public permissionService: PermissionService,
    public router: Router
  ) {
    super(messageService, permissionService, router);
  }
  logo: string = environment.urlLogo;
  pages: Page[];
  sideMenu: any;
  ngOnInit() {
    if (environment.namePrint === "Vintrans") {
      this.styleBackGround = "#fff";
    } else {
      this.styleBackGround = "#000000";
    } 
    this.sideMenu = jQuery(this.el.nativeElement).find("#side-menu");

    this.pageService.getMenuByModuleId(1).subscribe(x => {
      if (!super.isValidResponse(x)) return;
      this.pages = x.data as Page[];

      this.pages.forEach(element => {
        element.children = this.pages.filter(
          x => x.parentPageId === element.id
        );
      });

      this.sideMenu.metisMenu("dispose");

      if (jQuery("body").hasClass("fixed-sidebar")) {
        jQuery(".sidebar-collapse").slimscroll({
          height: "100%"
        });
      }
      this.pages.forEach(element => {
        element.display = "none";
        element.active = "noactive";
      });
    });
  }

  ngAfterViewInit() {
    jQuery("#side-menu").metisMenu();

    if (jQuery("body").hasClass("fixed-sidebar")) {
      jQuery(".sidebar-collapse").slimscroll({
        height: "100%"
      });
    }
  }

  selectNav(select) {
    if (
      !select.parentPageId &&
      (select.children && select.children.length === 0)
    ) {
      this.pages.forEach(x => {
        if (x != select) {
          let index = this.pages.indexOf(x);
          this.pages[index].display = "none";
          this.pages[index].active = "noactive";
        }
      });
      this.isToggle = false;
    }
    if (
      !select.parentPageId &&
      (select.children && select.children.length > 0)
    ) {
      let index = this.pages.indexOf(select);
      this.saveSelected();
      this.selectNavItemIndex = index;
    }
  }

  saveSelected() {
    this.saveSelectedIndex = this.selectNavItemIndex;
  }

  showItems(event, page) {
    setTimeout(() => {
      if (
        this.saveSelectedIndex == null ||
        this.saveSelectedIndex !== this.selectNavItemIndex
      ) {
        this.isToggle = true;
        this.pages[this.selectNavItemIndex].display = "block";
        this.pages[this.selectNavItemIndex].active = "active";
        if (this.saveSelectedIndex) {
          this.pages[this.saveSelectedIndex].display = "none";
          this.pages[this.saveSelectedIndex].active = "noactive";
        }
      } else {
        this.pages[this.selectNavItemIndex].display = "none";
        this.pages[this.selectNavItemIndex].active = "noactive";
        if (this.saveSelectedIndex) {
          this.pages[this.saveSelectedIndex].display = "none";
          this.pages[this.saveSelectedIndex].active = "noactive";
        }
        //
        this.isToggleItem();
      }
    }, 0);
  }

  isToggleItem() {
    if (this.isToggle == false) {
      this.pages[this.selectNavItemIndex].display = "block";
      this.pages[this.selectNavItemIndex].active = "active";
      this.isToggle = true;
    } else {
      this.pages[this.selectNavItemIndex].display = "none";
      this.pages[this.selectNavItemIndex].active = "noactive";
      this.isToggle = false;
    }
  }
}
