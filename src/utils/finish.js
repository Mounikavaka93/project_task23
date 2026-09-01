export const finishOf = (product, name) =>
  product?.colors?.find((c) => c.name === name) || product?.colors?.[0] || null

export const coverImages = (product, name) => finishOf(product, name)?.images || product?.images || []

export const coverThumb = (product, name) => coverImages(product, name)[0]
