"use strict";
(self["webpackChunkfrontend"] = self["webpackChunkfrontend"] || []).push([["main"],{

/***/ 4114:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppRoutingModule: () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _components_bike_list_bike_list_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/bike-list/bike-list.component */ 1641);
/* harmony import */ var _components_bike_detail_bike_detail_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/bike-detail/bike-detail.component */ 7145);
/* harmony import */ var _components_add_bike_add_bike_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/add-bike/add-bike.component */ 5969);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);






const routes = [{
  path: '',
  redirectTo: 'bikes',
  pathMatch: 'full'
}, {
  path: 'bikes',
  component: _components_bike_list_bike_list_component__WEBPACK_IMPORTED_MODULE_0__.BikeListComponent
}, {
  path: 'bikes/add',
  component: _components_add_bike_add_bike_component__WEBPACK_IMPORTED_MODULE_2__.AddBikeComponent
}, {
  path: 'bikes/:id',
  component: _components_bike_detail_bike_detail_component__WEBPACK_IMPORTED_MODULE_1__.BikeDetailComponent
}];
class AppRoutingModule {
  static {
    this.ɵfac = function AppRoutingModule_Factory(t) {
      return new (t || AppRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({
      type: AppRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule.forRoot(routes), _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](AppRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
  });
})();

/***/ }),

/***/ 92:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 5072);


const _c0 = () => ({
  exact: false
});
class AppComponent {
  constructor() {
    this.title = 'Bikewear';
  }
  static {
    this.ɵfac = function AppComponent_Factory(t) {
      return new (t || AppComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AppComponent,
      selectors: [["app-root"]],
      decls: 11,
      vars: 2,
      consts: [[1, "navbar"], [1, "navbar-brand"], [1, "brand-icon"], ["routerLink", "/bikes", 1, "brand-name"], [1, "navbar-links"], ["routerLink", "/bikes", "routerLinkActive", "active", 3, "routerLinkActiveOptions"], [1, "main-content"]],
      template: function AppComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "nav", 0)(1, "div", 1)(2, "span", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "\uD83D\uDEB4");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "a", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Bikewear");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 4)(7, "a", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "R\u00E4der");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "main", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "router-outlet");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLinkActiveOptions", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterOutlet, _angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterLinkActive],
      styles: [".navbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  background: #1a1a2e;\n  padding: 0 32px;\n  height: 56px;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.18);\n}\n\n.navbar-brand[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n\n.brand-icon[_ngcontent-%COMP%] { font-size: 1.3rem; }\n\n.brand-name[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 1.15rem;\n  font-weight: 700;\n  text-decoration: none;\n  letter-spacing: 0.02em;\n}\n\n.navbar-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: rgba(255,255,255,0.75);\n  text-decoration: none;\n  font-size: 0.95rem;\n  padding: 4px 0;\n  border-bottom: 2px solid transparent;\n  transition: color 0.15s, border-color 0.15s;\n}\n\n.navbar-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, .navbar-links[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%] {\n  color: #fff;\n  border-bottom-color: #e55a2b;\n}\n\n.main-content[_ngcontent-%COMP%] {\n  max-width: 1100px;\n  margin: 0 auto;\n  padding: 32px 24px;\n}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLDhCQUE4QjtFQUM5QixtQkFBbUI7RUFDbkIsZUFBZTtFQUNmLFlBQVk7RUFDWixzQ0FBc0M7QUFDeEM7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLFNBQVM7QUFDWDs7QUFFQSxjQUFjLGlCQUFpQixFQUFFOztBQUVqQztFQUNFLFdBQVc7RUFDWCxrQkFBa0I7RUFDbEIsZ0JBQWdCO0VBQ2hCLHFCQUFxQjtFQUNyQixzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSw2QkFBNkI7RUFDN0IscUJBQXFCO0VBQ3JCLGtCQUFrQjtFQUNsQixjQUFjO0VBQ2Qsb0NBQW9DO0VBQ3BDLDJDQUEyQztBQUM3Qzs7QUFFQTs7RUFFRSxXQUFXO0VBQ1gsNEJBQTRCO0FBQzlCOztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLGNBQWM7RUFDZCxrQkFBa0I7QUFDcEIiLCJzb3VyY2VzQ29udGVudCI6WyIubmF2YmFyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBiYWNrZ3JvdW5kOiAjMWExYTJlO1xuICBwYWRkaW5nOiAwIDMycHg7XG4gIGhlaWdodDogNTZweDtcbiAgYm94LXNoYWRvdzogMCAycHggOHB4IHJnYmEoMCwwLDAsMC4xOCk7XG59XG5cbi5uYXZiYXItYnJhbmQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDEwcHg7XG59XG5cbi5icmFuZC1pY29uIHsgZm9udC1zaXplOiAxLjNyZW07IH1cblxuLmJyYW5kLW5hbWUge1xuICBjb2xvcjogI2ZmZjtcbiAgZm9udC1zaXplOiAxLjE1cmVtO1xuICBmb250LXdlaWdodDogNzAwO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGxldHRlci1zcGFjaW5nOiAwLjAyZW07XG59XG5cbi5uYXZiYXItbGlua3MgYSB7XG4gIGNvbG9yOiByZ2JhKDI1NSwyNTUsMjU1LDAuNzUpO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGZvbnQtc2l6ZTogMC45NXJlbTtcbiAgcGFkZGluZzogNHB4IDA7XG4gIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgdHJhbnNpdGlvbjogY29sb3IgMC4xNXMsIGJvcmRlci1jb2xvciAwLjE1cztcbn1cblxuLm5hdmJhci1saW5rcyBhOmhvdmVyLFxuLm5hdmJhci1saW5rcyBhLmFjdGl2ZSB7XG4gIGNvbG9yOiAjZmZmO1xuICBib3JkZXItYm90dG9tLWNvbG9yOiAjZTU1YTJiO1xufVxuXG4ubWFpbi1jb250ZW50IHtcbiAgbWF4LXdpZHRoOiAxMTAwcHg7XG4gIG1hcmdpbjogMCBhdXRvO1xuICBwYWRkaW5nOiAzMnB4IDI0cHg7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 635:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppModule: () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-browser */ 436);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 4114);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 92);
/* harmony import */ var _components_bike_list_bike_list_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/bike-list/bike-list.component */ 1641);
/* harmony import */ var _components_bike_detail_bike_detail_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/bike-detail/bike-detail.component */ 7145);
/* harmony import */ var _components_add_bike_add_bike_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/add-bike/add-bike.component */ 5969);
/* harmony import */ var _components_wear_part_form_wear_part_form_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/wear-part-form/wear-part-form.component */ 6915);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 7580);










class AppModule {
  static {
    this.ɵfac = function AppModule_Factory(t) {
      return new (t || AppModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({
      type: AppModule,
      bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent]
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({
      imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__.BrowserModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.ReactiveFormsModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_9__.HttpClientModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent, _components_bike_list_bike_list_component__WEBPACK_IMPORTED_MODULE_2__.BikeListComponent, _components_bike_detail_bike_detail_component__WEBPACK_IMPORTED_MODULE_3__.BikeDetailComponent, _components_add_bike_add_bike_component__WEBPACK_IMPORTED_MODULE_4__.AddBikeComponent, _components_wear_part_form_wear_part_form_component__WEBPACK_IMPORTED_MODULE_5__.WearPartFormComponent],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__.BrowserModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.ReactiveFormsModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_9__.HttpClientModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule]
  });
})();

/***/ }),

/***/ 5969:
/*!***********************************************************!*\
  !*** ./src/app/components/add-bike/add-bike.component.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AddBikeComponent: () => (/* binding */ AddBikeComponent)
/* harmony export */ });
/* harmony import */ var _models_bike_category__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../models/bike-category */ 3029);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_bike_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/bike.service */ 3507);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 4456);






function AddBikeComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r0.error);
  }
}
function AddBikeComponent_option_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "option", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const cat_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", cat_r2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](cat_r2);
  }
}
class AddBikeComponent {
  constructor(bikeService, router) {
    this.bikeService = bikeService;
    this.router = router;
    this.categories = Object.values(_models_bike_category__WEBPACK_IMPORTED_MODULE_0__.BikeCategory);
    this.error = '';
    this.saving = false;
    this.bike = {
      name: '',
      kategorie: _models_bike_category__WEBPACK_IMPORTED_MODULE_0__.BikeCategory.Rennrad,
      kilometerstand: 0,
      stravaId: ''
    };
  }
  save() {
    if (!this.bike.name?.trim()) {
      this.error = 'Bitte einen Namen angeben.';
      return;
    }
    this.saving = true;
    this.bikeService.addBike(this.bike).subscribe({
      next: created => {
        this.router.navigate(['/bikes', created.id]);
      },
      error: () => {
        this.error = 'Fehler beim Speichern des Rads.';
        this.saving = false;
      }
    });
  }
  cancel() {
    this.router.navigate(['/bikes']);
  }
  static {
    this.ɵfac = function AddBikeComponent_Factory(t) {
      return new (t || AddBikeComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_bike_service__WEBPACK_IMPORTED_MODULE_1__.BikeService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: AddBikeComponent,
      selectors: [["app-add-bike"]],
      decls: 28,
      vars: 8,
      consts: [[1, "back-link", 3, "click"], ["class", "error", 4, "ngIf"], [1, "form-card", 3, "ngSubmit"], [1, "form-group"], ["for", "name"], ["id", "name", "type", "text", "name", "name", "placeholder", "z.B. Canyon Ultimate", "required", "", 3, "ngModelChange", "ngModel"], ["for", "kategorie"], ["id", "kategorie", "name", "kategorie", 3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["for", "km"], ["id", "km", "type", "number", "name", "kilometerstand", "min", "0", 3, "ngModelChange", "ngModel"], ["for", "stravaId"], ["id", "stravaId", "type", "text", "name", "stravaId", "placeholder", "Strava Rad-ID", 3, "ngModelChange", "ngModel"], [1, "form-actions"], ["type", "submit", 1, "btn-primary", 3, "disabled"], ["type", "button", 1, "btn-secondary", 3, "click"], [1, "error"], [3, "value"]],
      template: function AddBikeComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function AddBikeComponent_Template_div_click_0_listener() {
            return ctx.cancel();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "\u2190 Zur\u00FCck");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "h2");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Neues Rad hinzuf\u00FCgen");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, AddBikeComponent_div_4_Template, 2, 1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "form", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngSubmit", function AddBikeComponent_Template_form_ngSubmit_5_listener() {
            return ctx.save();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 3)(7, "label", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, "Name");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "input", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayListener"]("ngModelChange", function AddBikeComponent_Template_input_ngModelChange_9_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayBindingSet"](ctx.bike.name, $event) || (ctx.bike.name = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "div", 3)(11, "label", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12, "Kategorie");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "select", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayListener"]("ngModelChange", function AddBikeComponent_Template_select_ngModelChange_13_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayBindingSet"](ctx.bike.kategorie, $event) || (ctx.bike.kategorie = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](14, AddBikeComponent_option_14_Template, 2, 2, "option", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "div", 3)(16, "label", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17, "Aktueller Kilometerstand");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "input", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayListener"]("ngModelChange", function AddBikeComponent_Template_input_ngModelChange_18_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayBindingSet"](ctx.bike.kilometerstand, $event) || (ctx.bike.kilometerstand = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "div", 3)(20, "label", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](21, "Strava-ID (optional)");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "input", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayListener"]("ngModelChange", function AddBikeComponent_Template_input_ngModelChange_22_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayBindingSet"](ctx.bike.stravaId, $event) || (ctx.bike.stravaId = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](23, "div", 13)(24, "button", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](25);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](26, "button", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function AddBikeComponent_Template_button_click_26_listener() {
            return ctx.cancel();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](27, "Abbrechen");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayProperty"]("ngModel", ctx.bike.name);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayProperty"]("ngModel", ctx.bike.kategorie);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.categories);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayProperty"]("ngModel", ctx.bike.kilometerstand);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayProperty"]("ngModel", ctx.bike.stravaId);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.saving);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx.saving ? "Speichert..." : "Rad speichern", " ");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.MinValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgForm],
      styles: [".back-link[_ngcontent-%COMP%] {\n  cursor: pointer;\n  color: #e55a2b;\n  font-size: 0.9rem;\n  margin-bottom: 20px;\n  display: inline-block;\n}\n\n.back-link[_ngcontent-%COMP%]:hover { text-decoration: underline; }\n\nh2[_ngcontent-%COMP%] {\n  margin: 0 0 24px;\n  font-size: 1.6rem;\n  color: #1a1a2e;\n}\n\n.form-card[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 12px;\n  padding: 28px;\n  box-shadow: 0 2px 10px rgba(0,0,0,0.07);\n  max-width: 480px;\n}\n\n.form-group[_ngcontent-%COMP%] {\n  margin-bottom: 18px;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: 600;\n  color: #555;\n}\n\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  padding: 9px 12px;\n  border: 1px solid #ddd;\n  border-radius: 7px;\n  font-size: 1rem;\n  outline: none;\n  transition: border-color 0.15s;\n}\n\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, .form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus {\n  border-color: #e55a2b;\n}\n\n.form-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  margin-top: 24px;\n}\n\n.error[_ngcontent-%COMP%] {\n  color: #c0392b;\n  margin-bottom: 14px;\n  font-size: 0.9rem;\n}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29tcG9uZW50cy9hZGQtYmlrZS9hZGQtYmlrZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsZUFBZTtFQUNmLGNBQWM7RUFDZCxpQkFBaUI7RUFDakIsbUJBQW1CO0VBQ25CLHFCQUFxQjtBQUN2Qjs7QUFFQSxtQkFBbUIsMEJBQTBCLEVBQUU7O0FBRS9DO0VBQ0UsZ0JBQWdCO0VBQ2hCLGlCQUFpQjtFQUNqQixjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtFQUNuQixhQUFhO0VBQ2IsdUNBQXVDO0VBQ3ZDLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLG1CQUFtQjtFQUNuQixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLFFBQVE7QUFDVjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixnQkFBZ0I7RUFDaEIsV0FBVztBQUNiOztBQUVBOztFQUVFLGlCQUFpQjtFQUNqQixzQkFBc0I7RUFDdEIsa0JBQWtCO0VBQ2xCLGVBQWU7RUFDZixhQUFhO0VBQ2IsOEJBQThCO0FBQ2hDOztBQUVBOztFQUVFLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYixTQUFTO0VBQ1QsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsY0FBYztFQUNkLG1CQUFtQjtFQUNuQixpQkFBaUI7QUFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyIuYmFjay1saW5rIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBjb2xvcjogI2U1NWEyYjtcbiAgZm9udC1zaXplOiAwLjlyZW07XG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxuLmJhY2stbGluazpob3ZlciB7IHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyB9XG5cbmgyIHtcbiAgbWFyZ2luOiAwIDAgMjRweDtcbiAgZm9udC1zaXplOiAxLjZyZW07XG4gIGNvbG9yOiAjMWExYTJlO1xufVxuXG4uZm9ybS1jYXJkIHtcbiAgYmFja2dyb3VuZDogI2ZmZjtcbiAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgcGFkZGluZzogMjhweDtcbiAgYm94LXNoYWRvdzogMCAycHggMTBweCByZ2JhKDAsMCwwLDAuMDcpO1xuICBtYXgtd2lkdGg6IDQ4MHB4O1xufVxuXG4uZm9ybS1ncm91cCB7XG4gIG1hcmdpbi1ib3R0b206IDE4cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGdhcDogNnB4O1xufVxuXG4uZm9ybS1ncm91cCBsYWJlbCB7XG4gIGZvbnQtc2l6ZTogMC44NXJlbTtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgY29sb3I6ICM1NTU7XG59XG5cbi5mb3JtLWdyb3VwIGlucHV0LFxuLmZvcm0tZ3JvdXAgc2VsZWN0IHtcbiAgcGFkZGluZzogOXB4IDEycHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gIGJvcmRlci1yYWRpdXM6IDdweDtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBvdXRsaW5lOiBub25lO1xuICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMC4xNXM7XG59XG5cbi5mb3JtLWdyb3VwIGlucHV0OmZvY3VzLFxuLmZvcm0tZ3JvdXAgc2VsZWN0OmZvY3VzIHtcbiAgYm9yZGVyLWNvbG9yOiAjZTU1YTJiO1xufVxuXG4uZm9ybS1hY3Rpb25zIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiAxMnB4O1xuICBtYXJnaW4tdG9wOiAyNHB4O1xufVxuXG4uZXJyb3Ige1xuICBjb2xvcjogI2MwMzkyYjtcbiAgbWFyZ2luLWJvdHRvbTogMTRweDtcbiAgZm9udC1zaXplOiAwLjlyZW07XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 7145:
/*!*****************************************************************!*\
  !*** ./src/app/components/bike-detail/bike-detail.component.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BikeDetailComponent: () => (/* binding */ BikeDetailComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _services_bike_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/bike.service */ 3507);
/* harmony import */ var _services_wear_part_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/wear-part.service */ 1237);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _wear_part_form_wear_part_form_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../wear-part-form/wear-part-form.component */ 6915);







function BikeDetailComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "L\u00E4dt...");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function BikeDetailComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r0.error);
  }
}
function BikeDetailComponent_ng_container_2_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](3, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function BikeDetailComponent_ng_container_2_ng_container_10_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r3);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r0.editingKm = true);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Aktualisieren");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](3, 1, ctx_r0.bike.kilometerstand, "1.0-0"), " km");
  }
}
function BikeDetailComponent_ng_container_2_ng_container_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "input", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayListener"]("ngModelChange", function BikeDetailComponent_ng_container_2_ng_container_11_Template_input_ngModelChange_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r4);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayBindingSet"](ctx_r0.newKilometerstand, $event) || (ctx_r0.newKilometerstand = $event);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"]($event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function BikeDetailComponent_ng_container_2_ng_container_11_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r4);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r0.saveKilometerstand());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, "Speichern");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function BikeDetailComponent_ng_container_2_ng_container_11_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r4);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r0.editingKm = false);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Abbrechen");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayProperty"]("ngModel", ctx_r0.newKilometerstand);
  }
}
function BikeDetailComponent_ng_container_2_app_wear_part_form_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "app-wear-part-form", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("saved", function BikeDetailComponent_ng_container_2_app_wear_part_form_17_Template_app_wear_part_form_saved_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r5);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r0.onWearPartAdded());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("radId", ctx_r0.bike.id)("currentKilometerstand", ctx_r0.bike.kilometerstand);
  }
}
function BikeDetailComponent_ng_container_2_div_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Noch keine Verschlei\u00DFteile erfasst. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function BikeDetailComponent_ng_container_2_table_19_tr_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "tr")(1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "td")(4, "span", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](8, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](11, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](14, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](17, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const part_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](part_r6.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](part_r6.kategorie);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](8, 6, part_r6.einbauKilometerstand, "1.0-0"), " km");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](11, 9, part_r6.einbauDatum, "dd.MM.yyyy"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](part_r6.ausbauKilometerstand ? _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](14, 12, part_r6.ausbauKilometerstand, "1.0-0") + " km" : "\u2014");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](part_r6.ausbauDatum ? _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](17, 15, part_r6.ausbauDatum, "dd.MM.yyyy") : "\u2014");
  }
}
function BikeDetailComponent_ng_container_2_table_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "table", 19)(1, "thead")(2, "tr")(3, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "Kategorie");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8, "Einbau km");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](10, "Einbau Datum");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](12, "Ausbau km");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](14, "Ausbau Datum");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](16, BikeDetailComponent_ng_container_2_table_19_tr_16_Template, 18, 18, "tr", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r0.wearParts);
  }
}
function BikeDetailComponent_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function BikeDetailComponent_ng_container_2_Template_div_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r2);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r0.goBack());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "\u2190 Zur\u00FCck zur \u00DCbersicht");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 6)(4, "div")(5, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](10, BikeDetailComponent_ng_container_2_ng_container_10_Template, 6, 4, "ng-container", 2)(11, BikeDetailComponent_ng_container_2_ng_container_11_Template, 6, 1, "ng-container", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "div", 9)(13, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](14, "Verschlei\u00DFteile");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function BikeDetailComponent_ng_container_2_Template_button_click_15_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r2);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r0.showWearPartForm = !ctx_r0.showWearPartForm);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](17, BikeDetailComponent_ng_container_2_app_wear_part_form_17_Template, 1, 2, "app-wear-part-form", 11)(18, BikeDetailComponent_ng_container_2_div_18_Template, 2, 0, "div", 12)(19, BikeDetailComponent_ng_container_2_table_19_Template, 17, 1, "table", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r0.bike.kategorie);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r0.bike.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx_r0.editingKm);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r0.editingKm);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r0.showWearPartForm ? "Abbrechen" : "+ Verschlei\u00DFteil hinzuf\u00FCgen", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r0.showWearPartForm && ctx_r0.bike);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r0.wearParts.length === 0 && !ctx_r0.showWearPartForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r0.wearParts.length > 0);
  }
}
class BikeDetailComponent {
  constructor(route, router, bikeService, wearPartService) {
    this.route = route;
    this.router = router;
    this.bikeService = bikeService;
    this.wearPartService = wearPartService;
    this.bike = null;
    this.wearParts = [];
    this.loading = false;
    this.error = '';
    this.editingKm = false;
    this.newKilometerstand = 0;
    this.showWearPartForm = false;
  }
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.bikeService.getBike(id).subscribe({
      next: bike => {
        this.bike = bike;
        this.newKilometerstand = bike.kilometerstand;
        this.loading = false;
        this.loadWearParts(id);
      },
      error: () => {
        this.error = 'Rad nicht gefunden.';
        this.loading = false;
      }
    });
  }
  loadWearParts(radId) {
    this.wearPartService.getWearPartsByBike(radId).subscribe({
      next: parts => this.wearParts = parts,
      error: () => this.error = 'Fehler beim Laden der Verschleißteile.'
    });
  }
  saveKilometerstand() {
    if (!this.bike) return;
    this.bikeService.updateKilometerstand(this.bike.id, this.newKilometerstand).subscribe({
      next: updated => {
        this.bike = updated;
        this.editingKm = false;
      },
      error: () => this.error = 'Fehler beim Speichern des Kilometerstands.'
    });
  }
  onWearPartAdded() {
    this.showWearPartForm = false;
    if (this.bike) this.loadWearParts(this.bike.id);
  }
  goBack() {
    this.router.navigate(['/bikes']);
  }
  static {
    this.ɵfac = function BikeDetailComponent_Factory(t) {
      return new (t || BikeDetailComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_bike_service__WEBPACK_IMPORTED_MODULE_0__.BikeService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_wear_part_service__WEBPACK_IMPORTED_MODULE_1__.WearPartService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: BikeDetailComponent,
      selectors: [["app-bike-detail"]],
      decls: 3,
      vars: 3,
      consts: [["class", "loading", 4, "ngIf"], ["class", "error", 4, "ngIf"], [4, "ngIf"], [1, "loading"], [1, "error"], [1, "back-link", 3, "click"], [1, "bike-header"], [1, "category-badge"], [1, "km-section"], [1, "section-header"], [1, "btn-primary", 3, "click"], [3, "radId", "currentKilometerstand", "saved", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["class", "wear-table", 4, "ngIf"], [1, "km-display"], [1, "btn-secondary", 3, "click"], ["type", "number", 1, "km-input", 3, "ngModelChange", "ngModel"], [3, "saved", "radId", "currentKilometerstand"], [1, "empty-state"], [1, "wear-table"], [4, "ngFor", "ngForOf"], [1, "part-badge"]],
      template: function BikeDetailComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](0, BikeDetailComponent_div_0_Template, 2, 0, "div", 0)(1, BikeDetailComponent_div_1_Template, 2, 1, "div", 1)(2, BikeDetailComponent_ng_container_2_Template, 20, 8, "ng-container", 2);
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.bike);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgModel, _wear_part_form_wear_part_form_component__WEBPACK_IMPORTED_MODULE_2__.WearPartFormComponent, _angular_common__WEBPACK_IMPORTED_MODULE_5__.DecimalPipe, _angular_common__WEBPACK_IMPORTED_MODULE_5__.DatePipe],
      styles: [".back-link[_ngcontent-%COMP%] {\n  cursor: pointer;\n  color: #e55a2b;\n  font-size: 0.9rem;\n  margin-bottom: 20px;\n  display: inline-block;\n}\n\n.back-link[_ngcontent-%COMP%]:hover { text-decoration: underline; }\n\n.bike-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  flex-wrap: wrap;\n  gap: 16px;\n  margin-bottom: 32px;\n}\n\n.category-badge[_ngcontent-%COMP%] {\n  font-size: 0.73rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: #e55a2b;\n}\n\n.bike-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 4px 0 0;\n  font-size: 1.8rem;\n  color: #1a1a2e;\n}\n\n.km-section[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex-wrap: wrap;\n}\n\n.km-display[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  font-weight: 700;\n  color: #1a1a2e;\n}\n\n.km-input[_ngcontent-%COMP%] {\n  width: 130px;\n  padding: 6px 10px;\n  border: 1px solid #ccc;\n  border-radius: 6px;\n  font-size: 1rem;\n}\n\n.section-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 16px;\n}\n\n.section-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.2rem;\n  color: #1a1a2e;\n}\n\n.wear-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.9rem;\n}\n\n.wear-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background: #f7f7fa;\n  padding: 10px 14px;\n  text-align: left;\n  font-weight: 600;\n  color: #555;\n  border-bottom: 2px solid #e8e8ee;\n}\n\n.wear-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 10px 14px;\n  border-bottom: 1px solid #f0f0f0;\n  color: #333;\n}\n\n.wear-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%] { background: #fafafe; }\n\n.part-badge[_ngcontent-%COMP%] {\n  background: #f0f0f0;\n  border-radius: 4px;\n  padding: 2px 7px;\n  font-size: 0.78rem;\n  color: #444;\n}\n\n.empty-state[_ngcontent-%COMP%] {\n  color: #888;\n  margin-top: 20px;\n  font-size: 0.95rem;\n}\n\n.loading[_ngcontent-%COMP%], .error[_ngcontent-%COMP%] { margin-top: 40px; color: #888; }\n.error[_ngcontent-%COMP%] { color: #c0392b; }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29tcG9uZW50cy9iaWtlLWRldGFpbC9iaWtlLWRldGFpbC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsZUFBZTtFQUNmLGNBQWM7RUFDZCxpQkFBaUI7RUFDakIsbUJBQW1CO0VBQ25CLHFCQUFxQjtBQUN2Qjs7QUFFQSxtQkFBbUIsMEJBQTBCLEVBQUU7O0FBRS9DO0VBQ0UsYUFBYTtFQUNiLDhCQUE4QjtFQUM5Qix1QkFBdUI7RUFDdkIsZUFBZTtFQUNmLFNBQVM7RUFDVCxtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsZ0JBQWdCO0VBQ2hCLHlCQUF5QjtFQUN6QixzQkFBc0I7RUFDdEIsY0FBYztBQUNoQjs7QUFFQTtFQUNFLGVBQWU7RUFDZixpQkFBaUI7RUFDakIsY0FBYztBQUNoQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsU0FBUztFQUNULGVBQWU7QUFDakI7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsZ0JBQWdCO0VBQ2hCLGNBQWM7QUFDaEI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLHNCQUFzQjtFQUN0QixrQkFBa0I7RUFDbEIsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLGFBQWE7RUFDYiw4QkFBOEI7RUFDOUIsbUJBQW1CO0VBQ25CLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLFNBQVM7RUFDVCxpQkFBaUI7RUFDakIsY0FBYztBQUNoQjs7QUFFQTtFQUNFLFdBQVc7RUFDWCx5QkFBeUI7RUFDekIsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsbUJBQW1CO0VBQ25CLGtCQUFrQjtFQUNsQixnQkFBZ0I7RUFDaEIsZ0JBQWdCO0VBQ2hCLFdBQVc7RUFDWCxnQ0FBZ0M7QUFDbEM7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsZ0NBQWdDO0VBQ2hDLFdBQVc7QUFDYjs7QUFFQSwwQkFBMEIsbUJBQW1CLEVBQUU7O0FBRS9DO0VBQ0UsbUJBQW1CO0VBQ25CLGtCQUFrQjtFQUNsQixnQkFBZ0I7RUFDaEIsa0JBQWtCO0VBQ2xCLFdBQVc7QUFDYjs7QUFFQTtFQUNFLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsa0JBQWtCO0FBQ3BCOztBQUVBLG1CQUFtQixnQkFBZ0IsRUFBRSxXQUFXLEVBQUU7QUFDbEQsU0FBUyxjQUFjLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyIuYmFjay1saW5rIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBjb2xvcjogI2U1NWEyYjtcbiAgZm9udC1zaXplOiAwLjlyZW07XG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxuLmJhY2stbGluazpob3ZlciB7IHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyB9XG5cbi5iaWtlLWhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgZ2FwOiAxNnB4O1xuICBtYXJnaW4tYm90dG9tOiAzMnB4O1xufVxuXG4uY2F0ZWdvcnktYmFkZ2Uge1xuICBmb250LXNpemU6IDAuNzNyZW07XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGxldHRlci1zcGFjaW5nOiAwLjA4ZW07XG4gIGNvbG9yOiAjZTU1YTJiO1xufVxuXG4uYmlrZS1oZWFkZXIgaDIge1xuICBtYXJnaW46IDRweCAwIDA7XG4gIGZvbnQtc2l6ZTogMS44cmVtO1xuICBjb2xvcjogIzFhMWEyZTtcbn1cblxuLmttLXNlY3Rpb24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDEwcHg7XG4gIGZsZXgtd3JhcDogd3JhcDtcbn1cblxuLmttLWRpc3BsYXkge1xuICBmb250LXNpemU6IDEuNHJlbTtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgY29sb3I6ICMxYTFhMmU7XG59XG5cbi5rbS1pbnB1dCB7XG4gIHdpZHRoOiAxMzBweDtcbiAgcGFkZGluZzogNnB4IDEwcHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG4gIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgZm9udC1zaXplOiAxcmVtO1xufVxuXG4uc2VjdGlvbi1oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIG1hcmdpbi1ib3R0b206IDE2cHg7XG59XG5cbi5zZWN0aW9uLWhlYWRlciBoMyB7XG4gIG1hcmdpbjogMDtcbiAgZm9udC1zaXplOiAxLjJyZW07XG4gIGNvbG9yOiAjMWExYTJlO1xufVxuXG4ud2Vhci10YWJsZSB7XG4gIHdpZHRoOiAxMDAlO1xuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICBmb250LXNpemU6IDAuOXJlbTtcbn1cblxuLndlYXItdGFibGUgdGgge1xuICBiYWNrZ3JvdW5kOiAjZjdmN2ZhO1xuICBwYWRkaW5nOiAxMHB4IDE0cHg7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGNvbG9yOiAjNTU1O1xuICBib3JkZXItYm90dG9tOiAycHggc29saWQgI2U4ZThlZTtcbn1cblxuLndlYXItdGFibGUgdGQge1xuICBwYWRkaW5nOiAxMHB4IDE0cHg7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZjBmMGYwO1xuICBjb2xvcjogIzMzMztcbn1cblxuLndlYXItdGFibGUgdHI6aG92ZXIgdGQgeyBiYWNrZ3JvdW5kOiAjZmFmYWZlOyB9XG5cbi5wYXJ0LWJhZGdlIHtcbiAgYmFja2dyb3VuZDogI2YwZjBmMDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBwYWRkaW5nOiAycHggN3B4O1xuICBmb250LXNpemU6IDAuNzhyZW07XG4gIGNvbG9yOiAjNDQ0O1xufVxuXG4uZW1wdHktc3RhdGUge1xuICBjb2xvcjogIzg4ODtcbiAgbWFyZ2luLXRvcDogMjBweDtcbiAgZm9udC1zaXplOiAwLjk1cmVtO1xufVxuXG4ubG9hZGluZywgLmVycm9yIHsgbWFyZ2luLXRvcDogNDBweDsgY29sb3I6ICM4ODg7IH1cbi5lcnJvciB7IGNvbG9yOiAjYzAzOTJiOyB9XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 1641:
/*!*************************************************************!*\
  !*** ./src/app/components/bike-list/bike-list.component.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BikeListComponent: () => (/* binding */ BikeListComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_bike_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/bike.service */ 3507);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 316);




function BikeListComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "L\u00E4dt...");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BikeListComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r0.error);
  }
}
function BikeListComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Noch keine R\u00E4der vorhanden. F\u00FCge dein erstes Rad hinzu!\n");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BikeListComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BikeListComponent_div_9_Template_div_click_0_listener() {
      const bike_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r2).$implicit;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r0.openDetail(bike_r3.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 12)(6, "span", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Kilometerstand");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](10, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const bike_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](bike_r3.kategorie);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](bike_r3.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind2"](10, 3, bike_r3.kilometerstand, "1.0-0"), " km");
  }
}
class BikeListComponent {
  constructor(bikeService, router) {
    this.bikeService = bikeService;
    this.router = router;
    this.bikes = [];
    this.loading = false;
    this.error = '';
  }
  ngOnInit() {
    this.loadBikes();
  }
  loadBikes() {
    this.loading = true;
    this.bikeService.getBikes().subscribe({
      next: bikes => {
        this.bikes = bikes;
        this.loading = false;
      },
      error: err => {
        this.error = 'Fehler beim Laden der Räder.';
        this.loading = false;
      }
    });
  }
  openDetail(id) {
    this.router.navigate(['/bikes', id]);
  }
  addBike() {
    this.router.navigate(['/bikes/add']);
  }
  static {
    this.ɵfac = function BikeListComponent_Factory(t) {
      return new (t || BikeListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_bike_service__WEBPACK_IMPORTED_MODULE_0__.BikeService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: BikeListComponent,
      selectors: [["app-bike-list"]],
      decls: 10,
      vars: 4,
      consts: [[1, "page-header"], [1, "btn-primary", 3, "click"], ["class", "loading", 4, "ngIf"], ["class", "error", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], [1, "bike-grid"], ["class", "bike-card", 3, "click", 4, "ngFor", "ngForOf"], [1, "loading"], [1, "error"], [1, "empty-state"], [1, "bike-card", 3, "click"], [1, "bike-category"], [1, "kilometerstand"], [1, "label"], [1, "value"]],
      template: function BikeListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "h2");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Meine R\u00E4der");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "button", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BikeListComponent_Template_button_click_3_listener() {
            return ctx.addBike();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "+ Rad hinzuf\u00FCgen");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, BikeListComponent_div_5_Template, 2, 0, "div", 2)(6, BikeListComponent_div_6_Template, 2, 1, "div", 3)(7, BikeListComponent_div_7_Template, 2, 0, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](9, BikeListComponent_div_9_Template, 11, 6, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.bikes.length === 0 && !ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.bikes);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.DecimalPipe],
      styles: [".page-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 24px;\n}\n\n.page-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.6rem;\n  color: #1a1a2e;\n}\n\n.bike-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));\n  gap: 20px;\n}\n\n.bike-card[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 12px;\n  padding: 20px;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.08);\n  cursor: pointer;\n  transition: transform 0.15s, box-shadow 0.15s;\n  border-left: 4px solid #e55a2b;\n}\n\n.bike-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 6px 16px rgba(0,0,0,0.13);\n}\n\n.bike-category[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: #e55a2b;\n  margin-bottom: 6px;\n}\n\n.bike-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 14px;\n  font-size: 1.15rem;\n  color: #1a1a2e;\n}\n\n.kilometerstand[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: baseline;\n  border-top: 1px solid #f0f0f0;\n  padding-top: 12px;\n}\n\n.kilometerstand[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  color: #888;\n}\n\n.kilometerstand[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  font-size: 1.05rem;\n  font-weight: 700;\n  color: #1a1a2e;\n}\n\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #888;\n  margin-top: 60px;\n  font-size: 1rem;\n}\n\n.loading[_ngcontent-%COMP%], .error[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 40px;\n  color: #888;\n}\n\n.error[_ngcontent-%COMP%] { color: #c0392b; }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29tcG9uZW50cy9iaWtlLWxpc3QvYmlrZS1saXN0LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxhQUFhO0VBQ2IsOEJBQThCO0VBQzlCLG1CQUFtQjtFQUNuQixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxTQUFTO0VBQ1QsaUJBQWlCO0VBQ2pCLGNBQWM7QUFDaEI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsNERBQTREO0VBQzVELFNBQVM7QUFDWDs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixtQkFBbUI7RUFDbkIsYUFBYTtFQUNiLHNDQUFzQztFQUN0QyxlQUFlO0VBQ2YsNkNBQTZDO0VBQzdDLDhCQUE4QjtBQUNoQzs7QUFFQTtFQUNFLDJCQUEyQjtFQUMzQix1Q0FBdUM7QUFDekM7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsZ0JBQWdCO0VBQ2hCLHlCQUF5QjtFQUN6QixzQkFBc0I7RUFDdEIsY0FBYztFQUNkLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixrQkFBa0I7RUFDbEIsY0FBYztBQUNoQjs7QUFFQTtFQUNFLGFBQWE7RUFDYiw4QkFBOEI7RUFDOUIscUJBQXFCO0VBQ3JCLDZCQUE2QjtFQUM3QixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsV0FBVztBQUNiOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLGdCQUFnQjtFQUNoQixjQUFjO0FBQ2hCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixnQkFBZ0I7RUFDaEIsV0FBVztBQUNiOztBQUVBLFNBQVMsY0FBYyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiLnBhZ2UtaGVhZGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBtYXJnaW4tYm90dG9tOiAyNHB4O1xufVxuXG4ucGFnZS1oZWFkZXIgaDIge1xuICBtYXJnaW46IDA7XG4gIGZvbnQtc2l6ZTogMS42cmVtO1xuICBjb2xvcjogIzFhMWEyZTtcbn1cblxuLmJpa2UtZ3JpZCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDI0MHB4LCAxZnIpKTtcbiAgZ2FwOiAyMHB4O1xufVxuXG4uYmlrZS1jYXJkIHtcbiAgYmFja2dyb3VuZDogI2ZmZjtcbiAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgcGFkZGluZzogMjBweDtcbiAgYm94LXNoYWRvdzogMCAycHggOHB4IHJnYmEoMCwwLDAsMC4wOCk7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMTVzLCBib3gtc2hhZG93IDAuMTVzO1xuICBib3JkZXItbGVmdDogNHB4IHNvbGlkICNlNTVhMmI7XG59XG5cbi5iaWtlLWNhcmQ6aG92ZXIge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTNweCk7XG4gIGJveC1zaGFkb3c6IDAgNnB4IDE2cHggcmdiYSgwLDAsMCwwLjEzKTtcbn1cblxuLmJpa2UtY2F0ZWdvcnkge1xuICBmb250LXNpemU6IDAuNzVyZW07XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGxldHRlci1zcGFjaW5nOiAwLjA4ZW07XG4gIGNvbG9yOiAjZTU1YTJiO1xuICBtYXJnaW4tYm90dG9tOiA2cHg7XG59XG5cbi5iaWtlLWNhcmQgaDMge1xuICBtYXJnaW46IDAgMCAxNHB4O1xuICBmb250LXNpemU6IDEuMTVyZW07XG4gIGNvbG9yOiAjMWExYTJlO1xufVxuXG4ua2lsb21ldGVyc3RhbmQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBiYXNlbGluZTtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNmMGYwZjA7XG4gIHBhZGRpbmctdG9wOiAxMnB4O1xufVxuXG4ua2lsb21ldGVyc3RhbmQgLmxhYmVsIHtcbiAgZm9udC1zaXplOiAwLjc4cmVtO1xuICBjb2xvcjogIzg4ODtcbn1cblxuLmtpbG9tZXRlcnN0YW5kIC52YWx1ZSB7XG4gIGZvbnQtc2l6ZTogMS4wNXJlbTtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgY29sb3I6ICMxYTFhMmU7XG59XG5cbi5lbXB0eS1zdGF0ZSB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6ICM4ODg7XG4gIG1hcmdpbi10b3A6IDYwcHg7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbn1cblxuLmxvYWRpbmcsIC5lcnJvciB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgbWFyZ2luLXRvcDogNDBweDtcbiAgY29sb3I6ICM4ODg7XG59XG5cbi5lcnJvciB7IGNvbG9yOiAjYzAzOTJiOyB9XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 6915:
/*!***********************************************************************!*\
  !*** ./src/app/components/wear-part-form/wear-part-form.component.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WearPartFormComponent: () => (/* binding */ WearPartFormComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _models_wear_part_category__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../models/wear-part-category */ 9431);
/* harmony import */ var _services_wear_part_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/wear-part.service */ 1237);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 4456);






function WearPartFormComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r0.error);
  }
}
function WearPartFormComponent_option_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const cat_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", cat_r2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](cat_r2);
  }
}
class WearPartFormComponent {
  ngOnInit() {
    this.part = {
      radId: this.radId,
      name: '',
      kategorie: _models_wear_part_category__WEBPACK_IMPORTED_MODULE_0__.WearPartCategory.Sonstiges,
      einbauKilometerstand: this.currentKilometerstand,
      ausbauKilometerstand: 0,
      einbauDatum: new Date(),
      ausbauDatum: undefined
    };
  }
  get einbauDatumStr() {
    if (!this.part.einbauDatum) return '';
    const d = new Date(this.part.einbauDatum);
    return d.toISOString().substring(0, 10);
  }
  set einbauDatumStr(val) {
    this.part.einbauDatum = val ? new Date(val) : undefined;
  }
  get ausbauDatumStr() {
    if (!this.part.ausbauDatum) return '';
    const d = new Date(this.part.ausbauDatum);
    return d.toISOString().substring(0, 10);
  }
  set ausbauDatumStr(val) {
    this.part.ausbauDatum = val ? new Date(val) : undefined;
  }
  save() {
    if (!this.part.name?.trim()) {
      this.error = 'Bitte einen Namen angeben.';
      return;
    }
    this.saving = true;
    this.wearPartService.addWearPart(this.part).subscribe({
      next: () => {
        this.saving = false;
        this.saved.emit();
      },
      error: () => {
        this.error = 'Fehler beim Speichern des Verschleißteils.';
        this.saving = false;
      }
    });
  }
  constructor(wearPartService) {
    this.wearPartService = wearPartService;
    this.currentKilometerstand = 0;
    this.saved = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.categories = Object.values(_models_wear_part_category__WEBPACK_IMPORTED_MODULE_0__.WearPartCategory);
    this.error = '';
    this.saving = false;
    this.part = {};
  }
  static {
    this.ɵfac = function WearPartFormComponent_Factory(t) {
      return new (t || WearPartFormComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_wear_part_service__WEBPACK_IMPORTED_MODULE_1__.WearPartService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: WearPartFormComponent,
      selectors: [["app-wear-part-form"]],
      inputs: {
        radId: "radId",
        currentKilometerstand: "currentKilometerstand"
      },
      outputs: {
        saved: "saved"
      },
      decls: 39,
      vars: 10,
      consts: [[1, "form-card"], ["class", "error", 4, "ngIf"], [1, "form-row"], [1, "form-group"], ["type", "text", "placeholder", "z.B. Continentral GP5000", 3, "ngModelChange", "ngModel"], [3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["type", "number", "min", "0", 3, "ngModelChange", "ngModel"], ["type", "date", 3, "ngModelChange", "ngModel"], [1, "optional"], [1, "form-actions"], [1, "btn-primary", 3, "click", "disabled"], [1, "error"], [3, "value"]],
      template: function WearPartFormComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "h4");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "Verschlei\u00DFteil erfassen");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, WearPartFormComponent_div_3_Template, 2, 1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 2)(5, "div", 3)(6, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "Name");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "input", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayListener"]("ngModelChange", function WearPartFormComponent_Template_input_ngModelChange_8_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayBindingSet"](ctx.part.name, $event) || (ctx.part.name = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "div", 3)(10, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](11, "Kategorie");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "select", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayListener"]("ngModelChange", function WearPartFormComponent_Template_select_ngModelChange_12_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayBindingSet"](ctx.part.kategorie, $event) || (ctx.part.kategorie = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](13, WearPartFormComponent_option_13_Template, 2, 2, "option", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "div", 2)(15, "div", 3)(16, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17, "Einbau Kilometerstand");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "input", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayListener"]("ngModelChange", function WearPartFormComponent_Template_input_ngModelChange_18_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayBindingSet"](ctx.part.einbauKilometerstand, $event) || (ctx.part.einbauKilometerstand = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "div", 3)(20, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](21, "Einbau Datum");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "input", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayListener"]("ngModelChange", function WearPartFormComponent_Template_input_ngModelChange_22_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayBindingSet"](ctx.einbauDatumStr, $event) || (ctx.einbauDatumStr = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](23, "div", 2)(24, "div", 3)(25, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](26, "Ausbau Kilometerstand ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](27, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](28, "(optional)");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](29, "input", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayListener"]("ngModelChange", function WearPartFormComponent_Template_input_ngModelChange_29_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayBindingSet"](ctx.part.ausbauKilometerstand, $event) || (ctx.part.ausbauKilometerstand = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](30, "div", 3)(31, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](32, "Ausbau Datum ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](33, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](34, "(optional)");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](35, "input", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayListener"]("ngModelChange", function WearPartFormComponent_Template_input_ngModelChange_35_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayBindingSet"](ctx.ausbauDatumStr, $event) || (ctx.ausbauDatumStr = $event);
            return $event;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "div", 10)(37, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function WearPartFormComponent_Template_button_click_37_listener() {
            return ctx.save();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](38);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayProperty"]("ngModel", ctx.part.name);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayProperty"]("ngModel", ctx.part.kategorie);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.categories);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayProperty"]("ngModel", ctx.part.einbauKilometerstand);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayProperty"]("ngModel", ctx.einbauDatumStr);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayProperty"]("ngModel", ctx.part.ausbauKilometerstand);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtwoWayProperty"]("ngModel", ctx.ausbauDatumStr);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.saving);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx.saving ? "Speichert..." : "Speichern", " ");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.MinValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgModel],
      styles: [".form-card[_ngcontent-%COMP%] {\n  background: #fafafa;\n  border: 1px solid #e8e8ee;\n  border-radius: 10px;\n  padding: 20px;\n  margin-bottom: 24px;\n}\n\n.form-card[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0 0 16px;\n  font-size: 1rem;\n  color: #1a1a2e;\n}\n\n.form-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n  margin-bottom: 16px;\n}\n\n@media (max-width: 600px) {\n  .form-row[_ngcontent-%COMP%] { grid-template-columns: 1fr; }\n}\n\n.form-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 0.82rem;\n  font-weight: 600;\n  color: #555;\n}\n\n.optional[_ngcontent-%COMP%] {\n  font-weight: 400;\n  color: #aaa;\n  font-size: 0.78rem;\n}\n\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  padding: 8px 11px;\n  border: 1px solid #ddd;\n  border-radius: 6px;\n  font-size: 0.95rem;\n  outline: none;\n  transition: border-color 0.15s;\n}\n\n.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, .form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus {\n  border-color: #e55a2b;\n}\n\n.form-actions[_ngcontent-%COMP%] {\n  margin-top: 4px;\n}\n\n.error[_ngcontent-%COMP%] {\n  color: #c0392b;\n  font-size: 0.88rem;\n  margin-bottom: 12px;\n}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29tcG9uZW50cy93ZWFyLXBhcnQtZm9ybS93ZWFyLXBhcnQtZm9ybS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsbUJBQW1CO0VBQ25CLHlCQUF5QjtFQUN6QixtQkFBbUI7RUFDbkIsYUFBYTtFQUNiLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixlQUFlO0VBQ2YsY0FBYztBQUNoQjs7QUFFQTtFQUNFLGFBQWE7RUFDYiw4QkFBOEI7RUFDOUIsU0FBUztFQUNULG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLFlBQVksMEJBQTBCLEVBQUU7QUFDMUM7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLFFBQVE7QUFDVjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixnQkFBZ0I7RUFDaEIsV0FBVztBQUNiOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLFdBQVc7RUFDWCxrQkFBa0I7QUFDcEI7O0FBRUE7O0VBRUUsaUJBQWlCO0VBQ2pCLHNCQUFzQjtFQUN0QixrQkFBa0I7RUFDbEIsa0JBQWtCO0VBQ2xCLGFBQWE7RUFDYiw4QkFBOEI7QUFDaEM7O0FBRUE7O0VBRUUscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLGNBQWM7RUFDZCxrQkFBa0I7RUFDbEIsbUJBQW1CO0FBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiLmZvcm0tY2FyZCB7XG4gIGJhY2tncm91bmQ6ICNmYWZhZmE7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlOGU4ZWU7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gIHBhZGRpbmc6IDIwcHg7XG4gIG1hcmdpbi1ib3R0b206IDI0cHg7XG59XG5cbi5mb3JtLWNhcmQgaDQge1xuICBtYXJnaW46IDAgMCAxNnB4O1xuICBmb250LXNpemU6IDFyZW07XG4gIGNvbG9yOiAjMWExYTJlO1xufVxuXG4uZm9ybS1yb3cge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XG4gIGdhcDogMTZweDtcbiAgbWFyZ2luLWJvdHRvbTogMTZweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDYwMHB4KSB7XG4gIC5mb3JtLXJvdyB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyOyB9XG59XG5cbi5mb3JtLWdyb3VwIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiA1cHg7XG59XG5cbi5mb3JtLWdyb3VwIGxhYmVsIHtcbiAgZm9udC1zaXplOiAwLjgycmVtO1xuICBmb250LXdlaWdodDogNjAwO1xuICBjb2xvcjogIzU1NTtcbn1cblxuLm9wdGlvbmFsIHtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgY29sb3I6ICNhYWE7XG4gIGZvbnQtc2l6ZTogMC43OHJlbTtcbn1cblxuLmZvcm0tZ3JvdXAgaW5wdXQsXG4uZm9ybS1ncm91cCBzZWxlY3Qge1xuICBwYWRkaW5nOiA4cHggMTFweDtcbiAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuICBmb250LXNpemU6IDAuOTVyZW07XG4gIG91dGxpbmU6IG5vbmU7XG4gIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjE1cztcbn1cblxuLmZvcm0tZ3JvdXAgaW5wdXQ6Zm9jdXMsXG4uZm9ybS1ncm91cCBzZWxlY3Q6Zm9jdXMge1xuICBib3JkZXItY29sb3I6ICNlNTVhMmI7XG59XG5cbi5mb3JtLWFjdGlvbnMge1xuICBtYXJnaW4tdG9wOiA0cHg7XG59XG5cbi5lcnJvciB7XG4gIGNvbG9yOiAjYzAzOTJiO1xuICBmb250LXNpemU6IDAuODhyZW07XG4gIG1hcmdpbi1ib3R0b206IDEycHg7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 3029:
/*!*****************************************!*\
  !*** ./src/app/models/bike-category.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BikeCategory: () => (/* binding */ BikeCategory)
/* harmony export */ });
var BikeCategory;
(function (BikeCategory) {
  BikeCategory["Rennrad"] = "Rennrad";
  BikeCategory["Gravel"] = "Gravel";
  BikeCategory["Mountainbike"] = "Mountainbike";
})(BikeCategory || (BikeCategory = {}));

/***/ }),

/***/ 9431:
/*!**********************************************!*\
  !*** ./src/app/models/wear-part-category.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WearPartCategory: () => (/* binding */ WearPartCategory)
/* harmony export */ });
var WearPartCategory;
(function (WearPartCategory) {
  WearPartCategory["Reifen"] = "Reifen";
  WearPartCategory["Kassette"] = "Kassette";
  WearPartCategory["Kettenblatt"] = "Kettenblatt";
  WearPartCategory["Kette"] = "Kette";
  WearPartCategory["Sonstiges"] = "Sonstiges";
})(WearPartCategory || (WearPartCategory = {}));

/***/ }),

/***/ 3507:
/*!******************************************!*\
  !*** ./src/app/services/bike.service.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BikeService: () => (/* binding */ BikeService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 6443);


class BikeService {
  constructor(http) {
    this.http = http;
    this.apiUrl = 'http://localhost:5059/api/bike';
  }
  getBikes() {
    return this.http.get(this.apiUrl);
  }
  getBike(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  addBike(bike) {
    return this.http.post(this.apiUrl, bike);
  }
  updateKilometerstand(id, kilometerstand) {
    return this.http.put(`${this.apiUrl}/${id}/kilometerstand`, kilometerstand);
  }
  static {
    this.ɵfac = function BikeService_Factory(t) {
      return new (t || BikeService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: BikeService,
      factory: BikeService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 1237:
/*!***********************************************!*\
  !*** ./src/app/services/wear-part.service.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WearPartService: () => (/* binding */ WearPartService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 6443);


class WearPartService {
  constructor(http) {
    this.http = http;
    this.apiUrl = 'http://localhost:5059/api/wearpart';
  }
  getWearParts() {
    return this.http.get(this.apiUrl);
  }
  getWearPartsByBike(radId) {
    return this.http.get(`${this.apiUrl}/bike/${radId}`);
  }
  getWearPart(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  addWearPart(wearPart) {
    return this.http.post(this.apiUrl, wearPart);
  }
  static {
    this.ɵfac = function WearPartService_Factory(t) {
      return new (t || WearPartService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: WearPartService,
      factory: WearPartService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 4429:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 436);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 635);


_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule).catch(err => console.error(err));

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4429)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map