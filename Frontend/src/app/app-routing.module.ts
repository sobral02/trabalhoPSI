import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterScreenComponent } from './register-screen/register-screen.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { FollowersPageComponent } from './followers-page/followers-page.component';
import { FollowingPageComponent } from './following-page/following-page.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { LibraryComponent } from './library/library.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CarrinhoDetailComponent } from './carrinho-detail/carrinho-detail.component';


const routes: Routes = [
  
  { path: 'login-screen', component: LoginScreenComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/login-screen', pathMatch: 'full' },
  { path: 'register-screen', component: RegisterScreenComponent },
  { path: 'user/:name', component: UserProfileComponent },
  { path: 'item/:name', component: ItemDetailComponent },
  { path: 'user-search', component: UserSearchComponent },
  { path: 'wishlist/:name', component: WishlistComponent },
  { path: 'edit-profile/:user', component: EditProfileComponent },
  { path: 'followers/:name', component: FollowersPageComponent },
  { path: 'following/:name', component: FollowingPageComponent },
  { path: 'library/:name', component: LibraryComponent },
  { path: 'carrinho', component: CarrinhoDetailComponent },
  { path: 'checkout/:name',component:CheckoutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
