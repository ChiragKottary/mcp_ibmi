/**
 * Utility functions for safely formatting values
 */

/**
 * Safely format a number to fixed decimal places
 * Returns the formatted string or a default value if the input is undefined/null/not a number
 * 
 * @param value The value to format
 * @param decimals The number of decimal places
 * @param defaultValue The default value to return if value is invalid
 * @returns Formatted string
 */
export function safeToFixed(value: any, decimals: number = 2, defaultValue: string = '0.00'): string {
  // Check if value exists and is a valid number
  if (value === undefined || value === null) return defaultValue;
  
  // Try to convert to number if it's not already
  const num = typeof value === 'number' ? value : Number(value);
  
  // Check if conversion resulted in a valid number
  if (isNaN(num)) return defaultValue;
  
  // Apply toFixed
  try {
    return num.toFixed(decimals);
  } catch (error) {
    console.error('Error in safeToFixed:', error);
    return defaultValue;
  }
}

/**
 * Format a currency value with dollar sign
 * 
 * @param value The value to format
 * @param decimals The number of decimal places
 * @returns Formatted currency string
 */
export function formatCurrency(value: any, decimals: number = 2): string {
  return `$${safeToFixed(value, decimals)}`;
}
