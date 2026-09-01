export const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

export const passwordRules = (v) => ({
  length: v.length >= 8,
  upper: /[A-Z]/.test(v),
  number: /\d/.test(v),
})

export const passwordOk = (v) => {
  const r = passwordRules(v)
  return r.length && r.upper && r.number
}

export const required = (v) => Boolean(String(v ?? '').trim())

export const validateLogin = ({ email, password }) => {
  const errors = {}
  if (!required(email)) errors.email = 'Email is required'
  else if (!emailOk(email)) errors.email = 'Enter a valid email'
  if (!required(password)) errors.password = 'Password is required'
  return errors
}

export const validateSignup = ({ name, email, password, confirm }) => {
  const errors = {}
  if (!required(name)) errors.name = 'Name is required'
  else if (name.trim().length < 2) errors.name = 'Name is too short'
  if (!required(email)) errors.email = 'Email is required'
  else if (!emailOk(email)) errors.email = 'Enter a valid email'
  if (!required(password)) errors.password = 'Password is required'
  else if (!passwordOk(password))
    errors.password = 'Use 8+ characters, one uppercase letter, and one number'
  if (!required(confirm)) errors.confirm = 'Confirm your password'
  else if (password !== confirm) errors.confirm = 'Passwords do not match'
  return errors
}

export const validateCheckout = (form) => {
  const errors = {}
  const fields = {
    fullName: 'Full name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    state: 'State',
    zip: 'Postal code',
    cardName: 'Name on card',
    cardNumber: 'Card number',
    expiry: 'Expiry',
    cvc: 'CVC',
  }
  Object.entries(fields).forEach(([key, label]) => {
    if (!required(form[key])) errors[key] = `${label} is required`
  })
  if (form.email && !emailOk(form.email)) errors.email = 'Enter a valid email'
  if (form.phone && !/^[+\d][\d\s-]{7,}$/.test(form.phone))
    errors.phone = 'Enter a valid phone number'
  const cardDigits = (form.cardNumber || '').replace(/\s/g, '')
  if (form.cardNumber && !/^\d{16}$/.test(cardDigits))
    errors.cardNumber = 'Enter a 16-digit card number'
  if (form.expiry && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry))
    errors.expiry = 'Use MM/YY'
  if (form.cvc && !/^\d{3,4}$/.test(form.cvc)) errors.cvc = 'Enter a valid CVC'
  if (form.zip && form.zip.trim().length < 4) errors.zip = 'Enter a valid postal code'
  return errors
}
