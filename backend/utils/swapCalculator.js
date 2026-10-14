/**
 * Rule-based Swap Value Calculator
 * Calculates estimated swap value based on condition, brand tier, and original retail price.
 */

// Condition multiplier ranges
const CONDITION_MULTIPLIERS = {
  'Like New': 0.85,    // 80 - 90%
  'Excellent': 0.72,   // 65 - 80%
  'Good': 0.55,        // 45 - 65%
  'Fair': 0.35         // 25 - 45%
};

// Brand tier factors
const PREMIUM_LUXURY_BRANDS = [
  'levis', "levi's", 'zara', 'nike', 'adidas', 'puma', 'under armour',
  'fabindia', 'manyavar', 'tommy hilfiger', 'calvin klein', 'ralph lauren',
  'superdry', 'raymond', 'allen solly', 'peter england', 'van heusen',
  'louis philippe', 'marks & spencer', 'w', 'biba', 'anita dongre'
];

const FAST_FASHION_BRANDS = [
  'h&m', 'roadster', 'max', 'pantaloons', 'westside', 'forever 21', 'zudio',
  'only', 'vero moda', 'jack & jones', 'flying machine', 'wrangler', 'pepe jeans'
];

const calculateEstimatedSwapValue = (originalPrice, condition, brand = '', category = '') => {
  const price = parseFloat(originalPrice) || 0;
  if (price <= 0) return 0;

  // Base condition factor
  const conditionFactor = CONDITION_MULTIPLIERS[condition] || 0.55;

  // Subtle brand multiplier
  const cleanBrand = (brand || '').toLowerCase().trim();
  let brandMultiplier = 1.0;

  if (PREMIUM_LUXURY_BRANDS.some(b => cleanBrand.includes(b))) {
    brandMultiplier = 1.08; // slight 8% retention boost for strong quality
  } else if (FAST_FASHION_BRANDS.some(b => cleanBrand.includes(b))) {
    brandMultiplier = 0.98;
  }

  // Calculate and round to neat number (nearest 10 or 50)
  const rawValue = price * conditionFactor * brandMultiplier;
  const roundedValue = Math.max(50, Math.round(rawValue / 10) * 10);

  return Math.min(price, roundedValue);
};

module.exports = {
  calculateEstimatedSwapValue,
  CONDITION_MULTIPLIERS
};
