interface Order {
  _id: string
  totalOrderPrice: number
  paymentMethodType: string
  isPaid: boolean
  createdAt: string
  cartItems: {
    _id: string
    count: number
    price: number
    product: {
      id: string
      title: string
      imageCover: string
    }
  }[]
}