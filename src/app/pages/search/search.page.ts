import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { forEach } from 'lodash';
import { BasePage } from 'src/app/base.page';
import { AppConstants } from 'src/app/core/models/config/AppConstants';
import { EventItem } from 'src/app/core/models/event/event';
import { User, UserProfile } from 'src/app/core/models/user/UserProfile';
import { APIService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { RegularSearchService } from 'src/app/core/services/regular-search/regular-search.service';
import { EventItemResponse, FiniteeUserOnMap, PostResponse, SalesItemResponse, ServiceResponse, RegularSearchUser } from '../map/models/MapSearchResult';
import { IonAccordionGroup } from '@ionic/angular';
import { LocationService } from 'src/app/core/services/location.service';
import { AddressMap, Area } from 'src/app/core/models/places/Address';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage extends BasePage implements OnInit {
  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;
  // segment1:boolean = true;
  // segment2:boolean = false;
  // segment3:boolean = false;
  // segment4:boolean = false;
  // segment5:boolean = false;
  constructor(private _regularSerachService: RegularSearchService,
    private locationService: LocationService,
    private authService: AuthService,
    private router: Router) {
    super(authService);
  }

  regularSearchUser: Array<RegularSearchUser> = [];  
  loadingResult: boolean = false;
  globalSearch: boolean = false;
  eventList: Array<EventItem> = [];
  userList: Array<User> = [];
  freeUserList: Array<FiniteeUserOnMap> = [];
  businessUserList: Array<FiniteeUserOnMap> = [];
  nonProfitUserList: Array<FiniteeUserOnMap> = [];
  salesItemList: Array<SalesItemResponse> = [];
  eventItemList: Array<EventItemResponse> = [];
  sevicesAvailableList: Array<ServiceResponse> = [];
  sevicesRequiredList: Array<ServiceResponse> = [];
  postList: Array<PostResponse> = [];
  currentArea: Area = { Coordinate: {
        Latitude: 0.0,
        Longitude: 0.0,
      },
      Locality: "",
      City: "",
      Zip: "",
      State: "",
      Country: "",
      CountryId: -1
    };


  filteredResults: Array<any> = [];
  selectedFilter: any;
  searchFilters: any = [
    {title: 'All', value: 'RegAllSearch', visible: "", selected: true, results: 0},
    // {title: 'Posts', value: 'posts', visible: "", selected: false, results: 0},
    {title: 'Users', value: 'RegSearchUsers', visible: "1,4", selected: false, results: 0},
    {title: 'Businesses', value: 'businesses', visible: "", selected: false, results: 0},
    {title: 'Nonprofits', value: 'nonprofits', visible: "", selected: false, results: 0},
    {title: 'Events', value: 'RegSearchEvents', visible: "", selected: false, results: 0},
    {title: 'Donations', searchFiltersvalue: 'donations', visible: "", selected: false, results: 0},
    {title: 'Sales listings', value: 'RegSearchSalesListing', visible: "", selected: false, results: 0},
    {title: 'Service available', value: 'RegSearchServiceAvailable', visible: "", selected: false, results: 0},
    {title: 'Service required', value: 'RegSearchServiceRequired', visible: "", selected: false, results: 0},
    {title: 'Totems', value: 'totems', visible: "", selected: false, results: 0}
  ]


  ionViewWillEnter(){
    // this.searchData();
  }

  ngOnInit() {
    this.selectedFilter = this.getSelectedFilter();

    this.fetchCurrentArea();
  }

/*   ngOnChange(){
    alert("a");
    this.searchData();
  } */


  fetchCurrentArea() {

    let reverseGeocodingResult = this.locationService.observeReverseGeocodingResult().subscribe(async (address: AddressMap) => {
      console.log("SEARCH fetchCurrentArea observeReverseGeocodingResult: ", address);
      this.currentArea = this.locationService.getCurrentArea();
      console.log("SEARCH fetchCurrentArea Area: ", this.currentArea);
      // if (address) {
      //   this.currentArea = this.locationService.getCurrentArea();
      // }
    });

    this.locationService.requestPermissions();
    this.locationService.fetchCurrentCoordinate(true);

    // this.currentArea = new Area();
    // //this.currentArea.Coordinate = this.locationService.getCurrentCoordinate();

    // let latitude = this.locationService.getCurrentCoordinate() == null ? 0.0 : this.locationService.getCurrentCoordinate().latitude;
    // let longitude = this.locationService.getCurrentCoordinate() == null ? 0.0 : this.locationService.getCurrentCoordinate().longitude;
    // this.currentArea.Coordinate = {Latitude: latitude, Longitude: longitude};
  }

  // async searchData(title?:string) {
  //   var result = await this._regularSerachService.regularSearch(title);
  //   this.eventList = result.EventList;
  //   this.userList = result.UserList;
  // }


  openUser(user: FiniteeUserOnMap) {
    console.log("openUser: ", user);

    const navigationExtras1s: NavigationExtras = {
      state: {
        data: user
      }
    };
    if (user.UserTypeId == AppConstants.USER_TYPE.BN_USER)
      this.router.navigateByUrl('business-user-canvas-other', navigationExtras1s);
    else if (user.UserTypeId == AppConstants.USER_TYPE.FR_USER)
      this.router.navigateByUrl('free-user-canvas', navigationExtras1s);
  }

  openSalesItem(salesItem: SalesItemResponse) {
    this.router.navigateByUrl(`/sales-listing/sales-item-view/${salesItem.Id}`);
  }

  openServiceItem(service: ServiceResponse) {
    // this.router.navigateByUrl(`/sales-listing/sales-item-view/${salesItem.Id}`);
  }

  openPostScreen(post: any) {
    this.navEx!.state!['postlist'] = [post];//this.postList;
    this.navEx!.state!['selectedPost'] = post;
    this.navEx!.state!['postViewType'] = this.appConstants.POST_VIEW_TYPE.INSTA;
    this.navEx!.state!['postCommentViewType'] = this.appConstants.POST_COMMENT_VIEW_TYPE.POPUP;

    if (!(post.Type == "BEAM" || post.Type == "BEAM_POST"))//Not sure what is kept as final type
      this.navEx!.state!['event'] = "POSTLIST";
    this.router.navigateByUrl(`post/view-post`, this.navEx);
  }

  // openBeamPostScreen(post: any) {
  //   this.navEx!.state!['postlist'] = [post];//this.beamedpostList;
  //   this.navEx!.state!['selectedPost'] = post;
  //   this.navEx!.state!['postViewType'] = this.appConstants.POST_VIEW_TYPE.INSTA;
  //   this.navEx!.state!['postCommentViewType'] = this.appConstants.POST_COMMENT_VIEW_TYPE.POPUP;
  //   this.router.navigateByUrl(`post/view-post`, this.navEx);
  // }

  // View details of 'service available'
  viewServiceAvailable(id: any) {
    this.router.navigateByUrl(`service-available/service-available-view/${id}`);
  }

  // View details of 'service required'
  viewServiceRequired(id: any) {
    this.router.navigateByUrl(`service-required/service-required-view/${id}`);
  }

  getRequestObject(searchVal: string) {//TODO Manoj: Get Location, area valyes



    let requestObject = {
      // Area: {
      //   Location: {
      //     Latitude: this.currentCoordinate == null ? 0.0 : this.currentCoordinate.latitude,
      //     Longitude: this.currentCoordinate == null ? 0.0 : this.currentCoordinate.longitude,
      //   },
      //   Locality: "",
      //   City: "",
      //   Zip: "",
      //   State: "",
      //   Country: ""
      // },
      Area: this.currentArea,
      SearchKey: searchVal,
      Global: this.globalSearch,
      UserTypeId: this.logInfo.UserTypeId,
      Filter: [this.selectedFilter.value],
      Range: -1,
      AdvanceSearch: {
        FName: "",
        LName: "",
        Gender: "",
        Title: "",
        Workplace: "",
        City: "",
        Zip: "",
        State: "",
        Country: ""
      }
    }

    return requestObject;
  }

  async onSearchValueChange(event: any) {
    console.log("onSearchValueChange: ", event);
    console.log("global: ", this.globalSearch);
    console.log("filter: ", this.selectedFilter);

    if (event.detail != null && event.detail.value != null && event.detail.value.length > 1) { // min search on input of 2 chars
      let requestBody = this.getRequestObject(event.detail.value);
      console.log("requestBody: ", requestBody);
      // this.performRegularSearch(requestBody);
      if(requestBody.Filter[0] === 'RegSearchUsers'){
        const res = await this._regularSerachService.RegSearchUsers(requestBody.Filter[0], requestBody.SearchKey, this.logInfo.UserTypeId);
        if(res){
          console.log("RegSearchUsers", res, this.getSelectedFilter().results);
          this.regularSearchUser = res;
          this.setResultCount(requestBody.Filter[0], res.length);

        }else console.log("regular search user error");
      } else{
      var result = await this._regularSerachService.regularSearch(requestBody.Filter[0], requestBody.SearchKey);
        if(result){
          console.log("regularSearch", result);
          this.regularSearchUser = result.FreeUserSearchRespond;
          // this.businessUserList = result.BusinessUsers;
          // this.nonProfitUserList = result.NonProfitUsers;
          this.salesItemList = result.SalesListingSearchRespond;
          this.eventItemList = result.EventSearchRespond;
          this.sevicesAvailableList = result.ServiceAvailableSearchRespond;
          this.sevicesRequiredList = result.ServiceRequiredSearchRespond;

          let allResult = this.regularSearchUser.length + this.salesItemList.length + this.eventItemList.length + this.salesItemList.length + this.sevicesRequiredList.length + this.viewServiceAvailable.length;

          this.setResultCount("RegAllSearch", allResult)
          this.setResultCount("RegSearchUsers", this.regularSearchUser.length);
          this.setResultCount("RegSearchEvents", this.eventItemList.length);
          this.setResultCount("RegSearchSalesListing", this.salesItemList.length);
          
        }else console.log("regularSearch error");
      } 

    }
  }

  performRegularSearch(requestBody: any) {
    console.log("performRegularSearch: ", requestBody);
    this.loadingResult = true;
    this._regularSerachService.apiService.regularSearch(requestBody)
    // this._regularSerachService.regularSearch(requestBody.Filter[0], requestBody.SearchKey)
      .subscribe({
        next: response => {
          console.log("changePassword: Response: ", response);
          this._regularSerachService.commonService.hideLoader();
          if (this._regularSerachService.apiService.isAPISuccessfull(response)) {
            console.log("performRegularSearch: Response: ", response);
            // this._regularSerachService.commonService.presentToast("Password changed successfully!");
            this.freeUserList = response.ResponseData.FreeUsers;
            this.businessUserList = response.ResponseData.BusinessUsers;
            this.nonProfitUserList = response.ResponseData.NonProfitUsers;
            this.salesItemList = response.ResponseData.SaleListings;
            this.eventItemList = response.ResponseData.Events;
            this.sevicesAvailableList = response.ResponseData.ServicesAvailable;
            this.sevicesRequiredList = response.ResponseData.ServicesRequired;
            this.postList = response.ResponseData.Posts;

            let totalResults = this.freeUserList.length + this.businessUserList.length + this.nonProfitUserList.length + this.salesItemList.length
            + this.eventItemList.length + this.sevicesAvailableList.length + this.sevicesRequiredList.length + this.postList.length;

            this.setResultCount("all", totalResults);
            this.setResultCount("users", this.freeUserList.length);
            this.setResultCount("businesses", this.businessUserList.length);
            this.setResultCount("nonprofits", this.nonProfitUserList.length);
            this.setResultCount("sales_listings", this.salesItemList.length);
            this.setResultCount("events", this.eventItemList.length);
            this.setResultCount("service_available", this.sevicesAvailableList.length);
            this.setResultCount("service_required", this.sevicesRequiredList.length);
            this.setResultCount("posts", this.postList.length);

            // console.log("performRegularSearch: freeUserList: ", this.freeUserList);
            // console.log("performRegularSearch: businessUserList: ", this.businessUserList);
            // console.log("performRegularSearch: nonProfitUserList: ", this.nonProfitUserList);
            // console.log("performRegularSearch: salesItemList: ", this.salesItemList);
            // console.log("performRegularSearch: eventItemList: ", this.eventItemList);
            // console.log("performRegularSearch: sevicesAvailableList: ", this.sevicesAvailableList);
            // console.log("performRegularSearch: sevicesRequiredList: ", this.sevicesRequiredList);
            // console.log("performRegularSearch: postList: ", this.postList);
          }
          else {
            this.resetResultCount();
            let errorMsg = (response.ResponseData && response.ResponseData.Error && response.ResponseData.Error.length > 0)? response.ResponseData.Error : "Error!";
            // this.errorMsgGrp.password = errorMsg;
            this._regularSerachService.commonService.presentToast(errorMsg);
          }
          this.loadingResult = false;
        },
        error: errorMsg => {
          this.resetResultCount();
          console.log("sendOTPOnEmail: Response error: ", errorMsg);
          this._regularSerachService.commonService.hideLoader();
          this._regularSerachService.commonService.presentToast(errorMsg);
          this.loadingResult = false;
        }
      });
  }

  setResultCount(filter: string, count: any) {
    console.log("setResultCount: ", filter, count);
    this.searchFilters.forEach((filterEntry: { results: number; value: any; }) => {
      if (filterEntry.value === filter) {
        filterEntry.results = count;
      }
    });
  }

  resetResultCount() {
    this.searchFilters.forEach((filterEntry: { results: number }) => {
      filterEntry.results = 0;
    });
  }

  getResultCount() {
    // console.log("result", this.getSelectedFilter().results);
    return this.getSelectedFilter().results;
    //return this.freeUserList.length + this.businessUserList.length + this.nonProfitUserList.length + this.salesItemList.length
    //+ this.eventItemList.length + this.sevicesAvailableList.length + this.sevicesRequiredList.length + this.postList.length;
  }

  filterChanged(value: any) {
    // if(value != "") this.searchData(value);
    this.searchFilters.forEach((filterEntry: { selected: boolean; value: any; }) => {
      filterEntry.selected = filterEntry.value === value;
    });
    this.selectedFilter = this.calculateSelectedFilter();
    console.log("filterChanged: ", this.selectedFilter);
  }

  getSelectedFilter() {
    if (!this.selectedFilter) {
      this.selectedFilter = this.calculateSelectedFilter();
    }
    return this.selectedFilter;
  }

  calculateSelectedFilter() {
    let selectedFilter = this.searchFilters[0];
    this.searchFilters.forEach((filterEntry: any) => {
      if (filterEntry.selected) {
        selectedFilter = filterEntry;
      }
    });
    return selectedFilter;
  }

  userCanViewSection(section: string) : boolean {
     let selectedFilter = this.getSelectedFilter();

      if (section == "RegSearchUsers" && (selectedFilter.value == "RegAllSearch" || selectedFilter.value == "RegSearchUsers")) {
        return this.logInfo.UserTypeId == this.appConstants.USER_TYPE.FR_USER || this.logInfo.UserTypeId == this.appConstants.USER_TYPE.ADMIN_USER;
      }
      else {
        if (selectedFilter.value == "RegAllSearch") {
          return true;
        }
        else {
          return section == selectedFilter.value;
        }
      }

  }

  getEventDescription(event: EventItemResponse) {
      return event.Description;
  }

  openEvent(event: EventItemResponse) {//EventItem) {
    this.router.navigateByUrl(`/events/event-view/${event.Id}`);
  }
  //   segmentChanged(event)
  //   {
  //     var segment = event.target.value;
  //     if(segment == "segment1")
  //     {
  //       this.segment1 = true;
  //       this.segment2 = false;
  //       this.segment3 = false;
  //       this.segment4 = false;
  //       this.segment5 = false;


  //     }
  //     else if(segment == "segment2")
  //     {
  //        this.segment1 = false;
  //       this.segment2 = true;
  //       this.segment3 = false;
  //       this.segment4 = false;
  //       this.segment5 = false;

  //     }
  //      else if(segment == "segment3")
  //     {
  //        this.segment1 = false;
  //       this.segment2 = false;
  //       this.segment3 = true;
  //       this.segment4 = false;
  //       this.segment5 = false;

  //     }
  //      else if(segment == "segment4")
  //     {
  //        this.segment1 = false;
  //       this.segment2 = false;
  //       this.segment3 = false;
  //       this.segment4 = true;
  //       this.segment5 = false;

  //     }
  //      else if(segment == "segment5")
  //     {
  //        this.segment1 = false;
  //       this.segment2 = false;
  //       this.segment3 = false;
  //       this.segment4 = false;
  //       this.segment5 = true;

  //     }
  // }
}
