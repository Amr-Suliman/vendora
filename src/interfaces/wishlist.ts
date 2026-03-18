export interface WishlistProduct {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  quantity: number;
  brand: {
    name: string;
  };
}
