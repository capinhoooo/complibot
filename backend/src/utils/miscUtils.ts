export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// Generate random alphanumeric ID using crypto.getRandomValues
export const getAlphanumericId = (length: number = 16): string => {
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (v) => alphabet[v % alphabet.length]).join('');
};

export const shortenAddress = (address: string, startLength: number = 6, endLength: number = 4): string => {
  return address.slice(0, startLength) + '...' + address.slice(-endLength);
};
