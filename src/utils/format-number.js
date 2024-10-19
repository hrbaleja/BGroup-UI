import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}
export function fNumbers(number) {
  return numeral(number).format('0.00');
}
export function fCurrencyold(number) {
  const format = number ? numeral(number).format('0,0.00') : '';

  return result(format, '00000.00');
}

export function fCurrency(number) {
  if (number === null || number === undefined) {
    return '';
  }

  const formatted = formatIndianCurrency(number);
  return formatted;
}

function formatIndianCurrency(number) {
  // Convert to string and split into whole and decimal parts
  const isNegative = number < 0; // Check if the number is negative
  const absoluteNumber = Math.abs(number); // Get the absolute value of the number
  const [whole, decimal] = absoluteNumber.toString().split('.');

  // Ensure decimal part has two digits
  const formattedDecimal = decimal ? decimal.padEnd(2, '0').slice(0, 2) : '00';

  // Check if the whole part is less than 1000
  if (parseInt(whole, 10) < 1000) {
    return `${isNegative ? '-' : ''}${whole}.${formattedDecimal}`; // Return with sign for negative numbers
  }

  // Format whole number part with Indian style
  const lastThreeDigits = whole.slice(-3);
  const otherDigits = whole.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  // Use template literals for formatting
  const formattedWhole = otherDigits ? `${otherDigits},${lastThreeDigits}` : lastThreeDigits;

  // Combine whole and decimal parts
  return `${isNegative ? '-' : ''}${formattedWhole}.${formattedDecimal}`; // Add sign for negative numbers
}

export function fShortenNumber(number) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}