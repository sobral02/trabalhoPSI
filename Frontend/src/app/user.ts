import { Item } from './item';

export interface User {
  name: string;
  password: string;
  library: string[];
  profilePicture: string;
  wishlist: string[];
  customLists: string[];
  followingLists: string[];
  followerLists: string[];
  carrinho: string[];
}
