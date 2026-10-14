// Client-side rule-based swap value calculator matching backend rules

export const CONDITION_MULTIPLIERS = {
  'Like New': 0.85,
  'Excellent': 0.72,
  'Good': 0.55,
  'Fair': 0.35
};

const PREMIUM_LUXURY_BRANDS = [
  'levis', "levi's", 'zara', 'nike', 'adidas', 'puma', 'under armour',
  'fabindia', 'manyavar', 'tommy hilfiger', 'calvin klein', 'ralph lauren',
  'superdry', 'raymond', 'allen solly', 'peter england', 'van heusen',
  'louis philippe', 'marks & spencer', 'w', 'biba', 'anita dongre'
];

export const calculateEstimatedSwapValue = (originalPrice, condition, brand = '') => {
  const price = parseFloat(originalPrice) || 0;
  if (price <= 0) return 0;

  const conditionFactor = CONDITION_MULTIPLIERS[condition] || 0.55;
  const cleanBrand = (brand || '').toLowerCase().trim();
  let brandMultiplier = 1.0;

  if (PREMIUM_LUXURY_BRANDS.some(b => cleanBrand.includes(b))) {
    brandMultiplier = 1.08;
  }

  const rawValue = price * conditionFactor * brandMultiplier;
  const roundedValue = Math.max(50, Math.round(rawValue / 10) * 10);

  return Math.min(price, roundedValue);
};

export const formatINR = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};
