import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
// import { loginguardGuard } from './services/loginguard.guard';
const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'welcome',
  //   loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  // },
//   {
//     path: '',
//     redirectTo: 'login',
//     pathMatch: 'full', // Redirect to the login page by default
//   },
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationPageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./category/category.module').then(m => m.CategoryPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'bestdeal',
    loadChildren: () => import('./bestdeal/bestdeal.module').then(m => m.BestdealPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'sort-by',
    loadChildren: () => import('./modals/sort-by/sort-by.module').then(m => m.SortByPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'item-details/:itemId',
    loadChildren: () => import('./item-details/item-details.module').then(m => m.ItemDetailsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'address',
    loadChildren: () => import('./modals/address/address.module').then(m => m.AddressPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then(m => m.CartPageModule),
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'orders',
  //   loadChildren: () => import('./orders/orders.module').then( m => m.OrdersPageModule)
  // },
  {
    path: 'orderplaced',
    loadChildren: () => import('./modals/orderplaced/orderplaced.module').then(m => m.OrderplacedPageModule),
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'profile',
  //   loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  // },
  {
    path: 'editprofile',
    loadChildren: () => import('./editprofile/editprofile.module').then(m => m.EditprofilePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'changepassword',
    loadChildren: () => import('./changepassword/changepassword.module').then(m => m.ChangepasswordPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'privacy',
    loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'termsandcondition',
    loadChildren: () => import('./termsandcondition/termsandcondition.module').then(m => m.TermsandconditionPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-address',
    loadChildren: () => import('./add-address/add-address.module').then(m => m.AddAddressPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'edit-address',
    loadChildren: () => import('./edit-address/edit-address.module').then(m => m.EditAddressPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'wishlist',
    loadChildren: () => import('./wishlist/wishlist.module').then(m => m.WishlistPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'order-details/:IdOrder',
    loadChildren: () => import('./order-details/order-details.module').then(m => m.OrderDetailsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'customalert',
    loadChildren: () => import('./modals/customalert/customalert.module').then(m => m.CustomalertPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-location',
    loadChildren: () => import('./add-location/add-location.module').then( m => m.AddLocationPageModule)
  },
  {
    path: 'edit-location/:addressId',
    loadChildren: () => import('./edit-location/edit-location.module').then( m => m.EditLocationPageModule)
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}