const sgd = new Intl.NumberFormat('en-SG', {
  style: 'currency',
  currency: 'SGD',
  maximumFractionDigits: 0,
})

export const formatSGD = (n: number) => sgd.format(n).replace('SGD', 'S$')

export const formatPrice = (price: number | null) =>
  price == null ? 'Price on request' : formatSGD(price)
