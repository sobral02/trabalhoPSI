export interface Item {
  name: string;
  description: string;
  type: string;
  platform: string;
  languages: string[];
  price: number;
  overallRating: number;
  ratings: {
    name: string;
    rating: number;
    comment: string;
  }[];
  mainImage?: string;
  secondaryImages?: string[];
  video?: string;
}
