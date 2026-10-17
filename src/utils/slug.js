// Generates ultra-short, memorable share slugs (e.g. '7k9m', '4x2p')
// Uses unambiguous alphanumeric characters (excluding 0, O, 1, l, I)

const CHARS = '23456789abcdefghjkmnpqrstuvwxyz';

export function generatePieSlug(length = 4) {
  let slug = '';
  // Use crypto.getRandomValues if available for true randomness
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      slug += CHARS[values[i] % CHARS.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      slug += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
  }
  return slug;
}
