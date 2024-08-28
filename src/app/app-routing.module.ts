import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./pages/notifications/notifications.module').then(
        (m) => m.NotificationsPageModule
      ),
  },
  {
    path: 'business-product-modal',
    loadChildren: () =>
      import(
        './core/popup/business-product-modal/business-product-modal.module'
      ).then((m) => m.BusinessProductModalPageModule),
  },
  {
    path: 'chat-detail/:id',
    loadChildren: () =>
      import('./pages/chat/chat-detail/chat-detail.module').then(
        (m) => m.ChatDetailPageModule
      ),
  },
  {
    path: 'video-cover-selection',
    loadChildren: () =>
      import('./pages/video-cover-selection/video-cover-selection.module').then(
        (m) => m.VideoCoverSelectionPageModule
      ),
  },
  {
    path: 'business-other-menu-modal',
    loadChildren: () =>
      import(
        './core/popup/business-other-menu-modal/business-other-menu-modal.module'
      ).then((m) => m.BusinessOtherMenuModalPageModule),
  },
  {
    path: 'free-user-canvas',
    loadChildren: () =>
      import('./pages/home/free-user-canvas/free-user-canvas.module').then(
        (m) => m.FreeUserCanvasPageModule
      ),
  },
  {
    path: 'edit-personal',
    loadChildren: () => import('./pages/home/free-user-canvas/edit-personal/edit-personal.module').then((m) => m.EditPersonalModule),
  },
  {
    path: 'free-user-canvas-other-menu-modal',
    loadChildren: () =>
      import(
        './core/popup/free-user-canvas-other-menu-modal/free-user-canvas-other-menu-modal.module'
      ).then((m) => m.FreeUserCanvasOtherMenuModalPageModule),
  },

  // Service alert
  {
    path: 'service-alert',
    loadChildren: () =>
      import("./pages/sidemenu/finitee-services/service-alert/service-alert-main/service-alert-main.module").then(s => s.ServiceAlertMainModule),
  },

  {
    path: 'service-alert/create-edit-service-alert',
    loadChildren: () => import('./pages/sidemenu/finitee-services/service-alert/create-edit-service-alert/create-edit-service-alert.module').then( m => m.CreateEditServiceAlertPageModule)
  },

  {
    path: 'service-alert/service-alert-matches-list',
    loadChildren: () => import('./pages/sidemenu/finitee-services/service-alert/service-alert-matches-list/service-alert-matches-list.module').then( m => m.ServiceAlertMatchesListPageModule)
  },

  
  //service required pages start
  {
    path: 'service-required',
    loadChildren: () =>
      import("./pages/sidemenu/finitee-services/service-required/service-required-list/service-required-list.module").then(m => m.ServiceRequiredListModule),
  },
  {
    path: 'service-required/create-edit-service-required',
    loadChildren: () => import('./pages/sidemenu/finitee-services/service-required/create-edit-service-required/create-edit-service-required.module').then(m => m.CreateEditServiceRequiredModule)
  },
  {
    path: 'service-required/service-required-view/:id',
    loadChildren: () => import('./pages/sidemenu/finitee-services/service-required/service-required-view/service-required-view.module').then(m => m.ServiceRequiredViewModule)
  },
  //service required pages end

  //service available pages start
  {
    path: 'service-available',
    loadChildren: () =>
      import("./pages/sidemenu/finitee-services/service-available/service-available-list/service-available-list.module").then(m => m.ServiceAvailableListModule),
  },
  {
    path: 'service-available/create-edit-service-available',
    loadChildren: () => import('./pages/sidemenu/finitee-services/service-available/create-edit-service-available/create-edit-service-available.module').then(m => m.CreateEditServiceAvailableModule)
  },
  {
    path: 'service-available/service-available-view/:id',
    loadChildren: () => import('./pages/sidemenu/finitee-services/service-available/service-available-view/service-available-view.module').then(m => m.ServiceAvailableViewModule)
  },
  //service available pages end
  //events pages start
  {
    path: 'event-list',
    loadChildren: () => import('./pages/sidemenu/events/event-list/event-list.module').then(m => m.EventListPageModule)
  },
  {
    path: 'events/create-edit-event',
    loadChildren: () => import('./pages/sidemenu/events/create-edit-event/create-edit-event.module').then(m => m.CreateEditEventModule)
  },

  {
    path: 'events/event-view/:id',
    loadChildren: () => import('./pages/sidemenu/events/event-view/event-view.module').then(m => m.EventViewModule)
  },
  {
    path: 'events/request-rsvp/:id',
    loadChildren: () => import('./pages/sidemenu/events/request-rsvp/request-rsvp.module').then(m => m.RequestRsvpPageModule)
  },
 

  //sales listing pages start
  {
    path: 'sales-listing',
    loadChildren: () => import('./pages/sidemenu/sales-listing/sales-list/sales-list.module').then(m => m.SalesListModule)
  },
  {
    path: 'sales-listing/create-edit-sales-item',
    loadChildren: () => import('./pages/sidemenu/sales-listing/create-edit-sales-item/create-edit-sales-item.module').then(m => m.CreateEditSalesItemModule)
  },
  {
    path: 'sales-listing/sales-item-view/:id',
    loadChildren: () => import('./pages/sidemenu/sales-listing/sales-item-view/sales-item-view.module').then(m => m.SalesItemViewModule)
  },
  //sales listing  pages end

  {
    path: 'post/view-post',
    loadChildren: () => import('./pages/post/view-post/view-post.module').then(m => m.ViewPostModule)
  },
  {
    path: 'post/add-post',
    loadChildren: () => import('./pages/post/add-post/add-post.module').then(m => m.AddPostModule)
  },
  {
    path: 'post/update-post',
    loadChildren: () => import('./pages/post/update-post/update-post.module').then(m => m.UpdatePostModule)
  },
  {
    path: 'business-user-canvas-other',
    loadChildren: () => import('./pages/home/business-user-canvas/business-canvas.module').then((m) => m.BusinessCanvasPageModule),
  },
  {
    path: 'business-user-canvas',
    loadChildren: () => import('./pages/home/business-user-canvas/business-canvas.module').then((m) => m.BusinessCanvasPageModule),
  },
  {
    path: 'business-user-canvas-test',
    loadChildren: () => import('./pages/home/business-user-canvas-test/business-user-canvas-test.module').then(m => m.BusinessUserCanvasTestModule),
  },
  {
    path: 'business/edit-business-user-profile',
    loadChildren: () => import('./pages/home/business-user-canvas/edit-profile/edit-profile.module').then((m) => m.EditProfileModule),
  },
  {
    path: 'tabs/free-user-canvas/connected-members',
    loadChildren: () => import('./pages/connections/connected-members/connected-members.module').then((m) => m.ConnectedMembersModule),
  },
  {
    path: 'business/edit-privacy/:productId',
    loadChildren: () => import('./pages/home/business-user-canvas/product/edit-privacy/edit-privacy.module').then((m) => m.EditPrivacyModule),
  },
  {
    path: 'business/view-product/:productId',
    loadChildren: () => import('./pages/home/business-user-canvas/product/view-product/view-product.module').then(m => m.ViewProductModule)
  },
  {
    path: 'business/add-edit-product',
    loadChildren: () => import('./pages/home/business-user-canvas/product/add-edit-product/add-edit-product.module').then(m => m.AddEditProductModule)
  },
  {
    path: 'business/recommend-product',
    loadChildren: () => import('./pages/home/business-user-canvas/product/recommend-product/recommend-screen.module').then(m => m.RecommendProductModule)
  },
  {
    path: 'business/edit-menu-items',
    loadChildren: () => import('./pages/home/business-user-canvas/menu-items/edit-item/edit-item.module').then(m => m.EditMenuItemModule)
  },
  {
    path: 'business/add-edit-announcement',
    loadChildren: () => import('./pages/home/business-user-canvas/add-edit-announcement/add-edit-announcement.module').then(m => m.AddEditAnnouncementModule)
  },
  {
    path: 'donation',
    loadChildren: () => import('./pages/sidemenu/donation/donation.module').then((m) => m.DonationPageModule),
  },
  {
    path: 'confirm-donation',
    loadChildren: () => import('./pages/sidemenu/donation/confirm-donation/confirm-donation.module').then((m) => m.ConfirmDonationPageModule),
  },
  {
    path: 'nonprofit-donation-individual-other',
    loadChildren: () => import('./pages/sidemenu/donation/nonprofit-donation-individual-other/nonprofit-donation-individual-other.module').then(m => m.NonprofitDonationIndividualOtherPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/sidemenu/help/help.module').then((m) => m.HelpPageModule),
  },
  {
    path: 'account-management',
    loadChildren: () => import('./pages/sidemenu/account-management/account-management.module').then((m) => m.AccountManagementModule),
  },
  {
    path: 'account-management/edit-name',
    loadChildren: () => import('./pages/sidemenu/account-management/edit-name/edit-name.module').then((m) => m.EditNameModule),
  },
  {
    path: 'account-management/edit-username',
    loadChildren: () => import('./pages/sidemenu/account-management/edit-username/edit-username.module').then((m) => m.EditUsernameModule),
  },
  {
    path: 'account-management/edit-address',
    loadChildren: () => import('./pages/sidemenu/account-management/edit-address/edit-address.module').then((m) => m.EditAddressModule),
  },
  {
    path: 'account-management/edit-password',
    loadChildren: () => import('./pages/sidemenu/account-management/edit-password/edit-password.module').then((m) => m.EditPasswordModule),
  },
  {
    path: 'privacy',
    loadChildren: () => import('./pages/sidemenu/settings-privacy/setting-pivacy.module').then((m) => m.SettingPrivacyModule),
  },
  {
    path: 'sonar',
    loadChildren: () => import('./pages/sidemenu/settings-privacy/sonar/sonar.module').then( m => m.SonarPageModule)
  },
  {
    path: 'canvas',
    loadChildren: () => import('./pages/sidemenu/settings-privacy/canvas/canvas.module').then( m => m.CanvasPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/sidemenu/settings-privacy/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'connections',
    loadChildren: () => import('./pages/sidemenu/settings-privacy/connections/connections.module').then(m => m.ConnectionsPageModule)
  },
  {
    path: 'rolodex',
    loadChildren: () => import('./pages/sidemenu/rolodex/rolodex.module').then((m) => m.RolodexModule),
  },

  {
    path: 'e-card/:UserId',
    loadChildren: () => import('./pages/sidemenu/e-card/e-card.module').then((m) => m.ECardModule),
  },
  {
  path: 'edit-e-card',
  loadChildren: () => import('./pages/sidemenu/e-card/edit-e-card/edit-e-card.module').then((m) => m.EditECardPageModule),
},
  {
    path: 'media-viewer',
    loadChildren: () => import('./pages/media-viewer/media-viewer.module').then((m) => m.MediaViewerPageModule),
  },
  {
    path: 'recommend-user',
    loadChildren: () => import('./pages/home/recommend-user/recommend-user.module').then(m => m.RecommendUserModule)
  },
  {
    path: 'add-traits',
    loadChildren: () => import('./pages/post/add-traits/add-traits.module').then(m => m.AddTraitsModule)
  },
  // {
  //   path: 'terms-conditions',
  //   loadChildren: () => import('./pages/terms-conditions/terms-conditions.module').then(m => m.TermsConditionsPageModule)
  // },

  //fr-profile
  {
    path: 'fr-profile/:UserId',
    loadChildren: () => import('./pages/sidemenu/profile/profile.module').then((m) => m.profilePageModule),
  },
  {
    path: 'e-profile/:UserId',
    loadChildren: () => import('./pages/sidemenu/e-profile/e-profile.module').then((m) => m.EProfileModule),
  },
  {
    path: `fr-profile/loggedInUser/edit-personal`,
    loadChildren: () => import('./pages/sidemenu/profile/edit-personal/edit-personal.module').then((m) => m.EditPersonalModule),
  },
  {
    path: 'fr-profile/loggedInUser/edit-work',
    loadChildren: () => import('./pages/sidemenu/profile/edit-work/edit-work.module').then((m) => m.EditworkModule),
  },
  {
    path: 'fr-profile/loggedInUser/edit-education',
    loadChildren: () => import('./pages/sidemenu/profile/edit-education/edit-education.module').then((m) => m.EditeducationModule),
  },
  {
    path: 'fr-profile/loggedInUser/edit-traits',
    loadChildren: () => import('./pages/sidemenu/profile/edit-traits/edit-traits.module').then((m) => m.EdittraitsModule),
  },
  {
    path: 'fr-profile/loggedInUser/edit-contact',
    loadChildren: () => import('./pages/sidemenu/profile/edit-contact/edit-contact.module').then((m) => m.EditcontactModule),
  },

  // shopping listing
  {
    path: 'shopping-list',
    loadChildren: () => import('./pages/sidemenu/shopping-listing/shopping-list/shopping-list.module').then( m => m.ShoppingListPageModule)
  },
  {
    path: 'shopping-list/create-edit-shopping-list',
    loadChildren: () => import('./pages/sidemenu/shopping-listing/create-edit-shopping-list/create-edit-shopping-list.module').then( m => m.CreateEditShoppingListPageModule)
  },
  {
    path: 'shopping-list/shopping-wordsmatches-list',
    loadChildren: () => import('./pages/sidemenu/shopping-listing/shopping-wordsmatches-list/shopping-wordsmatches-list.module').then( m => m.ShoppingWordsmatchesListPageModule)
  },

  //legal
  {
    path: 'terms-conditions',
    loadChildren: () => import('./pages/sidemenu/legal/terms-and-conditions/terms-and-conditions.module').then( m => m.TermsAndConditionsModule)
  },
  {
    path: 'community-guidelines',
    loadChildren: () => import('./pages/sidemenu/legal/community-guidelines/community-guidelines.module').then(m => m.CommunityGuidelinesModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./pages/sidemenu/legal/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule)
  },

  //new-trait-page
  { 
    path: 'create-trait',
    loadChildren: () => import('./pages/home/free-user-canvas/new-trait-page/new-trait-page.component.module').then( m => m.NewTraitPageModule)
  },
  { 
    path: 'edit-trait',
    loadChildren: () => import('./pages/home/free-user-canvas/edit-trait-page/edit-trait-page.component.module').then( m => m.EditTraitModule)
  },
  {
    path: 'edit-e-card',
    loadChildren: () => import('./pages/sidemenu/e-card/edit-e-card/edit-e-card.module').then( m => m.EditECardPageModule)
  }





  //end
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
