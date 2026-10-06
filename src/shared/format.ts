const sgd = new Intl.NumberFormat('en-SG', {
  style: 'currency',
  currency: 'SGD',
  currencyDisplay: 'code',
  maximumFractionDigits: 0,
})

// en-SG renders a bare "$"; Singapore retail convention is "S$"
export const formatSGD = (n: number) => sgd.format(n).replace(/SGD\s?/, 'S$')

export const formatPrice = (price: number | null) =>
  price == null ? 'Price on request' : formatSGD(price)
