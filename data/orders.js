const orders = [
  {
    id: 1,
    customer: {
      name: "Velmira Customer",
      email: "customer@example.com"
    },
    products: [
      {
        productId: 1,
        quantity: 1,
        price: 35000
      }
    ],
    delivery: {
      address: "Abuja, Nigeria",
      method: "Standard Delivery"
    },
    paymentMethod: "Cash on Delivery",
    total: 35000,
    status: "Pending"
  }
];

module.exports = orders;