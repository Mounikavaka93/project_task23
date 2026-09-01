export const formatPrice = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)

export const calcDiscount = (price, original) => {
  if (!original || original <= price) return 0
  return Math.round(((original - price) / original) * 100)
}

export const compareToast = (result) =>
  result === 'removed'
    ? 'Removed from compare'
    : result === 'replaced'
      ? 'Compare holds 3. Oldest piece was replaced.'
      : 'Added to compare'
