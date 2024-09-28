import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'map',
        loadChildren: () =>
          import('../map/map.module').then((m) => m.MapPageModule),
      },
      {
        path: 'free-user-canvas',
        loadChildren: () =>
          import('../home/free-user-canvas/free-user-canvas.module').then(
            (m) => m.FreeUserCanvasPageModule
          ),
      },
      {
        path: 'business-user-canvas',
        loadChildren: () =>
          import('../home/business-user-canvas/business-canvas.module').then(
            (m) => m.BusinessCanvasPageModule
          ),
      },
      {
        path: 'connections',
        loadChildren: () =>
          import('../connections/connections.module').then(
            (m) => m.ConnectionsPageModule
          ),
      },
      {
        path: 'inflows',
        loadChildren: () =>
          import('../inflows/inflows.module').then((m) => m.InflowsPageModule),
      },
      {
        path: 'inflows',
        loadChildren: () =>
          import('../inflows/inflows.module').then((m) => m.InflowsPageModule),
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('../chat/chats/chats.module').then((m) => m.ChatsPageModule),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('../search/search.module').then((m) => m.SearchPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/map',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/map',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
