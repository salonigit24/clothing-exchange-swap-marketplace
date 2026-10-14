// Realistic Indian users and clothing items dataset for ClothSwap

const usersData = [
  {
    name: 'ClothSwap Admin',
    email: 'admin@swapwear.com',
    password: 'Admin@123',
    phone: '+91 9820011223',
    city: 'Mumbai',
    state: 'Maharashtra',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'Admin'
  },
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    password: 'User@123',
    phone: '+91 9811223344',
    city: 'Mumbai',
    state: 'Maharashtra',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    role: 'User'
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    password: 'User@123',
    phone: '+91 9822334455',
    city: 'Pune',
    state: 'Maharashtra',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    role: 'User'
  },
  {
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    password: 'User@123',
    phone: '+91 9833445566',
    city: 'Nagpur',
    state: 'Maharashtra',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    role: 'User'
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    password: 'User@123',
    phone: '+91 9844556677',
    city: 'Bengaluru',
    state: 'Karnataka',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    role: 'User'
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    password: 'User@123',
    phone: '+91 9855667788',
    city: 'Delhi',
    state: 'Delhi',
    profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    role: 'User'
  },
  {
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@example.com',
    password: 'User@123',
    phone: '+91 9866778899',
    city: 'Nashik',
    state: 'Maharashtra',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    role: 'User'
  },
  {
    name: 'Kabir Verma',
    email: 'kabir.verma@example.com',
    password: 'User@123',
    phone: '+91 9877889900',
    city: 'Hyderabad',
    state: 'Telangana',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    role: 'User'
  },
  {
    name: 'Tanvi Deshmukh',
    email: 'tanvi.deshmukh@example.com',
    password: 'User@123',
    phone: '+91 9888990011',
    city: 'Nagpur',
    state: 'Maharashtra',
    profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    role: 'User'
  },
  {
    name: 'Aditya Joshi',
    email: 'aditya.joshi@example.com',
    password: 'User@123',
    phone: '+91 9899001122',
    city: 'Pune',
    state: 'Maharashtra',
    profileImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    role: 'User'
  },
  {
    name: 'Meera Nair',
    email: 'meera.nair@example.com',
    password: 'User@123',
    phone: '+91 9900112233',
    city: 'Bengaluru',
    state: 'Karnataka',
    profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    role: 'User'
  },
  {
    name: 'Rahul Kapoor',
    email: 'rahul.kapoor@example.com',
    password: 'User@123',
    phone: '+91 9911223344',
    city: 'Mumbai',
    state: 'Maharashtra',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    role: 'User'
  },
  {
    name: 'Pooja Shinde',
    email: 'pooja.shinde@example.com',
    password: 'User@123',
    phone: '+91 9922334455',
    city: 'Nashik',
    state: 'Maharashtra',
    profileImage: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80',
    role: 'User'
  }
];

const clothesData = [
  {
    title: "Levi's Blue Denim Trucker Jacket",
    category: 'Jackets',
    type: 'Casual',
    brand: "Levi's",
    size: 'L',
    gender: 'Men',
    color: 'Classic Indigo Blue',
    condition: 'Like New',
    description: 'Iconic Levi’s classic blue denim jacket with copper shank buttons and chest flap pockets. Worn only twice, preserved in pristine condition. Zero stains or wear tears.',
    originalPrice: 4299,
    estimatedSwapValue: 3650,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Mumbai',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 1
  },
  {
    title: 'H&M Floral Tiered Midi Dress',
    category: 'Dresses',
    type: 'Casual',
    brand: 'H&M',
    size: 'M',
    gender: 'Women',
    color: 'Sage Green Floral',
    condition: 'Excellent',
    description: 'Breezy woven chiffon summer dress with gentle puff sleeves, sweetheart neckline, and botanical blossom prints. Comfortable lining inside.',
    originalPrice: 2299,
    estimatedSwapValue: 1650,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Pune',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 2
  },
  {
    title: 'Zara Casual Linen Spread Shirt',
    category: 'Shirts',
    type: 'Casual',
    brand: 'Zara',
    size: 'M',
    gender: 'Men',
    color: 'Warm Beige',
    condition: 'Like New',
    description: 'Breathable 100% European linen button-down shirt. Perfect resort wear or casual summer outing shirt. Clean collar and mother-of-pearl style buttons.',
    originalPrice: 2990,
    estimatedSwapValue: 2540,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Nagpur',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 3
  },
  {
    title: 'Nike Club Fleece Sports Hoodie',
    category: 'Hoodies',
    type: 'Activewear',
    brand: 'Nike',
    size: 'XL',
    gender: 'Unisex',
    color: 'Heather Charcoal Grey',
    condition: 'Good',
    description: 'Warm brushed fleece athletic hoodie with kangaroo pocket and embroidered Nike Swoosh on the chest. Very cozy for evening runs or casual weekends.',
    originalPrice: 3495,
    estimatedSwapValue: 1920,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Nagpur',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 3
  },
  {
    title: 'Roadster Washed Slim Fit Jeans',
    category: 'Jeans',
    type: 'Streetwear',
    brand: 'Roadster',
    size: '32',
    gender: 'Men',
    color: 'Medium Blue Stone Wash',
    condition: 'Good',
    description: 'Cotton stretch denim with mild whiskers and washed fade. Comfortable mid-rise waist with durable metal zip fly.',
    originalPrice: 1799,
    estimatedSwapValue: 990,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Nagpur',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 8
  },
  {
    title: 'Allen Solly Cotton Formal Shirt',
    category: 'Shirts',
    type: 'Formal',
    brand: 'Allen Solly',
    size: '40',
    gender: 'Men',
    color: 'Sky Blue Crisp',
    condition: 'Excellent',
    description: 'Premium pure cotton semi-formal work shirt with neat structured collar and modern slim profile. Starch-pressed and spotless.',
    originalPrice: 2199,
    estimatedSwapValue: 1580,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Pune',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 9
  },
  {
    title: 'FabIndia Handblock Printed Cotton Kurti',
    category: 'Kurtis',
    type: 'Traditional',
    brand: 'FabIndia',
    size: 'S',
    gender: 'Women',
    color: 'Indigo & Rust',
    condition: 'Like New',
    description: 'Authentic Bagru handblock printed straight kurti crafted from handloom cotton. Features side slits and subtle wooden buttons. Breathable and sustainable.',
    originalPrice: 2490,
    estimatedSwapValue: 2100,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Bengaluru',
    state: 'Karnataka',
    status: 'Available',
    userIndex: 4
  },
  {
    title: 'Manyavar Raw Silk Men Kurta Set',
    category: 'Ethnic Wear',
    type: 'Partywear',
    brand: 'Manyavar',
    size: 'L',
    gender: 'Men',
    color: 'Mustard Gold',
    condition: 'Excellent',
    description: 'Rich jacquard weave ethnic festive kurta with Churidar pyjama pants. Worn once for a family wedding function. Flawless shine and threadwork.',
    originalPrice: 4999,
    estimatedSwapValue: 3600,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Delhi',
    state: 'Delhi',
    status: 'Available',
    userIndex: 5
  },
  {
    title: 'Biba Zari Border Chanderi Saree',
    category: 'Sarees',
    type: 'Traditional',
    brand: 'Biba',
    size: 'Free Size',
    gender: 'Women',
    color: 'Deep Maroon with Antique Gold',
    condition: 'Like New',
    description: 'Elegant lightweight Chanderi silk saree with exquisite floral zari weaving along the pallu and borders. Includes unstitched matching blouse piece.',
    originalPrice: 5995,
    estimatedSwapValue: 5100,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Pune',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 2
  },
  {
    title: 'Zara Houndstooth Wool Blend Overcoat',
    category: 'Jackets',
    type: 'Formal',
    brand: 'Zara',
    size: 'L',
    gender: 'Women',
    color: 'Black & Off-White',
    condition: 'Excellent',
    description: 'Structured long winter coat featuring timeless houndstooth check, notched lapels, and double-breasted closure. Dry cleaned and ready for wear.',
    originalPrice: 7990,
    estimatedSwapValue: 5750,
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce667883?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Delhi',
    state: 'Delhi',
    status: 'Available',
    userIndex: 5
  },
  {
    title: 'Adidas Originals Trefoil Graphic T-Shirt',
    category: 'T-Shirts',
    type: 'Casual',
    brand: 'Adidas',
    size: 'M',
    gender: 'Men',
    color: 'Jet Black with White Logo',
    condition: 'Good',
    description: 'Classic heavy cotton jersey crewneck tee with rubberized rubber stamp trefoil logo. No fading, washed gently.',
    originalPrice: 1699,
    estimatedSwapValue: 930,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Mumbai',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 1
  },
  {
    title: 'Marks & Spencer Pleated Midi Skirt',
    category: 'Skirts',
    type: 'Casual',
    brand: 'Marks & Spencer',
    size: 'S',
    gender: 'Women',
    color: 'Champagne Gold Shimmer',
    condition: 'Like New',
    description: 'Accordian sunray pleated flowing skirt with an elasticated satin waistband. Drapes gracefully with flats or block heels.',
    originalPrice: 3499,
    estimatedSwapValue: 2970,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Bengaluru',
    state: 'Karnataka',
    status: 'Available',
    userIndex: 4
  },
  {
    title: 'Raymond Pure Wool Charcoal Trousers',
    category: 'Trousers',
    type: 'Formal',
    brand: 'Raymond',
    size: '34',
    gender: 'Men',
    color: 'Dark Charcoal Grey',
    condition: 'Excellent',
    description: 'Tailored premium wool-blend formal flat-front trousers with crease line and side slit pockets. Perfect for business meetings.',
    originalPrice: 3200,
    estimatedSwapValue: 2300,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Nashik',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 6
  },
  {
    title: 'Puma Rebound Joy High-Top Sneakers',
    category: 'Shoes',
    type: 'Streetwear',
    brand: 'Puma',
    size: 'UK 9',
    gender: 'Men',
    color: 'White & Navy Blue',
    condition: 'Excellent',
    description: 'Basketball-inspired retro high tops with cushioned SoftFoam+ sockliner and rubber traction outsoles. Clean uppers with minimal heel drag.',
    originalPrice: 4499,
    estimatedSwapValue: 3240,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Hyderabad',
    state: 'Telangana',
    status: 'Available',
    userIndex: 7
  },
  {
    title: 'W for Woman Embroidered A-Line Dress',
    category: 'Dresses',
    type: 'Traditional',
    brand: 'W',
    size: 'L',
    gender: 'Women',
    color: 'Teal Blue & Silver',
    condition: 'Good',
    description: 'Fusion festive midi dress with intricate silver cord embroidery around the round neck and 3/4th flared sleeves. Rayon crepe fabric.',
    originalPrice: 2799,
    estimatedSwapValue: 1540,
    images: [
      'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Nagpur',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 8
  },
  {
    title: 'Tommy Hilfiger Striped Oxford Cotton Shirt',
    category: 'Shirts',
    type: 'Casual',
    brand: 'Tommy Hilfiger',
    size: 'L',
    gender: 'Men',
    color: 'White & Navy Bengal Stripe',
    condition: 'Like New',
    description: '100% thick organic cotton Oxford shirt featuring button-down collar and signature flag embroidery on the chest pocket.',
    originalPrice: 4999,
    estimatedSwapValue: 4250,
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Mumbai',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 11
  },
  {
    title: 'H&M Knit Ribbed High-Neck Sweater',
    category: 'Hoodies',
    type: 'Casual',
    brand: 'H&M',
    size: 'S',
    gender: 'Women',
    color: 'Oatmeal Melange',
    condition: 'Excellent',
    description: 'Soft brushed knit sweater with slouchy dropped shoulders and ribbing at neck, cuffs, and hem. Very cozy autumn/winter essential.',
    originalPrice: 1999,
    estimatedSwapValue: 1440,
    images: [
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Nashik',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 12
  },
  {
    title: "Levi's 511 Slim Fit Raw Jeans",
    category: 'Jeans',
    type: 'Casual',
    brand: "Levi's",
    size: '30',
    gender: 'Men',
    color: 'Dark Indigo Unwashed',
    condition: 'Fair',
    description: 'Authentic 511 slim cut jeans. Some minor fading on back pockets and knee creases, otherwise sturdy denim with red tab in place.',
    originalPrice: 3799,
    estimatedSwapValue: 1330,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Hyderabad',
    state: 'Telangana',
    status: 'Available',
    userIndex: 7
  },
  {
    title: 'FabIndia Tussar Silk Dupatta Stole',
    category: 'Accessories',
    type: 'Traditional',
    brand: 'FabIndia',
    size: 'Free Size',
    gender: 'Women',
    color: 'Honey Beige with Kantha Work',
    condition: 'Like New',
    description: 'Handcrafted pure Tussar silk stole featuring delicate contrast Kantha embroidery and raw edge tassels. Adds royal flair to plain kurtas.',
    originalPrice: 2200,
    estimatedSwapValue: 1870,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Bengaluru',
    state: 'Karnataka',
    status: 'Available',
    userIndex: 10
  },
  {
    title: 'Van Heusen Ultra-Flex Chino Trousers',
    category: 'Trousers',
    type: 'Casual',
    brand: 'Allen Solly',
    size: '32',
    gender: 'Men',
    color: 'Olive Green Earth',
    condition: 'Good',
    description: 'Cotton elastane twill chinos with stretch comfort waist. Versatile smart casual shade that pairs well with white shirts or polo tees.',
    originalPrice: 2499,
    estimatedSwapValue: 1370,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Pune',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 9
  },
  {
    title: 'Zara Faux Leather Biker Jacket',
    category: 'Jackets',
    type: 'Streetwear',
    brand: 'Zara',
    size: 'M',
    gender: 'Women',
    color: 'Onyx Black',
    condition: 'Excellent',
    description: 'Cropped moto biker jacket with silver asymmetrical hardware, zipped cuffs, and snap collar. Soft faux leather without peeling.',
    originalPrice: 4990,
    estimatedSwapValue: 3590,
    images: [
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Mumbai',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 1
  },
  {
    title: 'Nike Air Max Excee Running Shoes',
    category: 'Shoes',
    type: 'Activewear',
    brand: 'Nike',
    size: 'UK 8',
    gender: 'Men',
    color: 'Black & Reflective Silver',
    condition: 'Good',
    description: 'Visible Max Air unit in the heel for lightweight cushioning. Mesh and leather overlays for support. Sole tread has plenty of life left.',
    originalPrice: 5995,
    estimatedSwapValue: 3300,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Nagpur',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 3
  },
  {
    title: 'Biba Flared Anarkali Kurta with Dupatta',
    category: 'Ethnic Wear',
    type: 'Traditional',
    brand: 'Biba',
    size: 'M',
    gender: 'Women',
    color: 'Royal Emerald Green',
    condition: 'Like New',
    description: 'Floor-length flared Anarkali silhouette with golden foil prints and gotta patti border detailing. Comes with matching chiffon dupatta.',
    originalPrice: 4299,
    estimatedSwapValue: 3650,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Nashik',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 6
  },
  {
    title: 'Peter England Classic Polo T-Shirt',
    category: 'T-Shirts',
    type: 'Casual',
    brand: 'Peter England',
    size: 'L',
    gender: 'Men',
    color: 'Maroon Burgundy',
    condition: 'Excellent',
    description: '100% combed cotton pique polo shirt with tipping on rib collar and cuffs. High color retention, smooth touch.',
    originalPrice: 1299,
    estimatedSwapValue: 935,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Delhi',
    state: 'Delhi',
    status: 'Available',
    userIndex: 5
  },
  {
    title: 'Superdry Orange Label Zip Hoodie',
    category: 'Hoodies',
    type: 'Casual',
    brand: 'Superdry',
    size: 'M',
    gender: 'Men',
    color: 'Navy Blue Marl',
    condition: 'Good',
    description: 'Full zip hooded sweat with drawstring hood and Superdry vintage logo embroidery on the left chest. Soft fleecy interior.',
    originalPrice: 4590,
    estimatedSwapValue: 2520,
    images: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Pune',
    state: 'Maharashtra',
    status: 'Available',
    userIndex: 2
  }
];

module.exports = {
  usersData,
  clothesData
};
