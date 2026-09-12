import { CurrencyCode } from '../types/invoice'

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  BDT: '৳',
  USD: '$',
  EUR: '€',
  GBP: '£',
}

export const CURRENCY_NAMES: Record<CurrencyCode, { singular: string; plural: string; fractional: string }> = {
  BDT: { singular: 'Taka', plural: 'Taka', fractional: 'Paisa' },
  USD: { singular: 'US Dollar', plural: 'US Dollars', fractional: 'Cents' },
  EUR: { singular: 'Euro', plural: 'Euros', fractional: 'Cents' },
  GBP: { singular: 'British Pound', plural: 'British Pounds', fractional: 'Pence' },
}

/**
 * Formats a number with appropriate currency symbol and commas
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'BDT'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '৳'
  const isNegative = amount < 0
  const absAmount = Math.abs(amount)
  
  let formattedNumber = ''
  if (currency === 'BDT') {
    // South Asian grouping: 1,00,000.00
    const parts = absAmount.toFixed(2).split('.')
    let integerPart = parts[0]
    const decimalPart = parts[1]
    
    if (integerPart.length > 3) {
      const lastThree = integerPart.substring(integerPart.length - 3)
      const otherNumbers = integerPart.substring(0, integerPart.length - 3)
      const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
      integerPart = formattedOther + ',' + lastThree
    }
    formattedNumber = decimalPart === '00' ? integerPart : `${integerPart}.${decimalPart}`
  } else {
    formattedNumber = absAmount.toLocaleString('en-US', {
      minimumFractionDigits: absAmount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })
  }

  return `${isNegative ? '-' : ''}${symbol} ${formattedNumber}`
}

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
]

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
]

function convertLessThanThousand(n: number): string {
  if (n === 0) return ''
  
  let words = ''
  if (n >= 100) {
    words += ONES[Math.floor(n / 100)] + ' Hundred '
    n %= 100
  }
  
  if (n >= 20) {
    words += TENS[Math.floor(n / 10)]
    if (n % 10 > 0) {
      words += '-' + ONES[n % 10]
    }
    words += ' '
  } else if (n > 0) {
    words += ONES[n] + ' '
  }
  
  return words.trim()
}

/**
 * Converts numbers into words using the South Asian numbering system (Crore, Lakh, Thousand)
 */
function convertSouthAsian(n: number): string {
  if (n === 0) return 'Zero'
  
  let result = ''
  
  // Crore (1,00,00,000)
  const crore = Math.floor(n / 10000000)
  if (crore > 0) {
    result += convertSouthAsian(crore) + ' Crore '
    n %= 10000000
  }
  
  // Lakh (1,00,000)
  const lakh = Math.floor(n / 100000)
  if (lakh > 0) {
    result += convertLessThanThousand(lakh) + ' Lakh '
    n %= 100000
  }
  
  // Thousand (1,000)
  const thousand = Math.floor(n / 1000)
  if (thousand > 0) {
    result += convertLessThanThousand(thousand) + ' Thousand '
    n %= 1000
  }
  
  // Remainder (< 1,000)
  if (n > 0) {
    result += convertLessThanThousand(n) + ' '
  }
  
  return result.trim()
}

/**
 * Converts numbers into words using the Western numbering system (Million, Thousand)
 */
function convertWestern(n: number): string {
  if (n === 0) return 'Zero'
  
  let result = ''
  
  const billion = Math.floor(n / 1000000000)
  if (billion > 0) {
    result += convertLessThanThousand(billion) + ' Billion '
    n %= 1000000000
  }
  
  const million = Math.floor(n / 1000000)
  if (million > 0) {
    result += convertLessThanThousand(million) + ' Million '
    n %= 1000000
  }
  
  const thousand = Math.floor(n / 1000)
  if (thousand > 0) {
    result += convertLessThanThousand(thousand) + ' Thousand '
    n %= 1000
  }
  
  if (n > 0) {
    result += convertLessThanThousand(n) + ' '
  }
  
  return result.trim()
}

/**
 * Converts a currency amount to words (e.g. "Ninety-Nine Thousand Seven Hundred Fifty Taka Only")
 */
export function amountToWords(amount: number, currency: CurrencyCode = 'BDT'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return ''
  }
  
  const absAmount = Math.abs(amount)
  const integerPart = Math.floor(absAmount)
  const decimalPart = Math.round((absAmount - integerPart) * 100)
  
  let words = ''
  if (currency === 'BDT') {
    words = convertSouthAsian(integerPart)
  } else {
    words = convertWestern(integerPart)
  }
  
  const currInfo = CURRENCY_NAMES[currency] || CURRENCY_NAMES.BDT
  const currencyWord = integerPart === 1 ? currInfo.singular : currInfo.plural
  
  let finalString = `${words} ${currencyWord}`
  
  if (decimalPart > 0) {
    const decimalWords = convertLessThanThousand(decimalPart)
    finalString += ` and ${decimalWords} ${currInfo.fractional}`
  }
  
  return `${finalString} Only`
}
