/**
 * Seed Script — Restaurant OMS
 * Populates: Categories, Menu Items, Tables, Admin User
 *
 * Run: node src/config/seed.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Table    = require('../models/Table');
const User     = require('../models/User');

// ─────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Starters',       description: 'Light bites to kick off your meal' },
  { name: 'Main Course',    description: 'Hearty mains cooked to perfection' },
  { name: 'Breads',         description: 'Fresh baked breads & rotis' },
  { name: 'Rice & Biryani', description: 'Fragrant rice dishes' },
  { name: 'Beverages',      description: 'Hot & cold drinks' },
  { name: 'Desserts',       description: 'Sweet endings to your meal' },
  { name: 'Fast Food',      description: 'Quick bites & snacks' },
  { name: 'Soups',          description: 'Warm & comforting soups' },
];

// Items are defined per category (name must match above)
const MENU_ITEMS_BY_CATEGORY = {
  'Starters': [
    {
      name: 'Paneer Tikka',
      description: 'Marinated cottage cheese cubes grilled in tandoor with spices',
      price: 220,
      preparationTime: 15,
      imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
      tags: ['veg', 'tandoor', 'popular'],
    },
    {
      name: 'Veg Spring Rolls',
      description: 'Crispy rolls stuffed with seasoned mixed vegetables',
      price: 150,
      preparationTime: 10,
      imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400',
      tags: ['veg', 'crispy'],
    },
    {
      name: 'Chicken Wings',
      description: 'Spicy buffalo-style chicken wings with dipping sauce',
      price: 280,
      preparationTime: 18,
      imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
      tags: ['non-veg', 'spicy', 'popular'],
    },
    {
      name: 'Hara Bhara Kabab',
      description: 'Soft spinach & peas patties seasoned with Indian spices',
      price: 170,
      preparationTime: 12,
      imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
      tags: ['veg', 'healthy'],
    },
    {
      name: 'Chicken 65',
      description: 'Deep-fried spicy chicken bites, South Indian style',
      price: 250,
      preparationTime: 15,
      imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400',
      tags: ['non-veg', 'spicy'],
    },
  ],

  'Main Course': [
    {
      name: 'Butter Chicken',
      description: 'Tender chicken in a rich, creamy tomato-butter gravy',
      price: 320,
      preparationTime: 20,
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
      tags: ['non-veg', 'popular', 'bestseller'],
    },
    {
      name: 'Paneer Butter Masala',
      description: 'Cottage cheese cubes in smooth, mildly spiced tomato gravy',
      price: 280,
      preparationTime: 18,
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
      tags: ['veg', 'popular'],
    },
    {
      name: 'Dal Makhani',
      description: 'Slow-cooked black lentils in a buttery, smoky gravy',
      price: 220,
      preparationTime: 15,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      tags: ['veg', 'healthy', 'bestseller'],
    },
    {
      name: 'Chicken Kadai',
      description: 'Spicy chicken cooked with peppers & onions in a wok',
      price: 340,
      preparationTime: 22,
      imageUrl: 'https://images.unsplash.com/photo-1602253057119-44d745d9b860?w=400',
      tags: ['non-veg', 'spicy'],
    },
    {
      name: 'Palak Paneer',
      description: 'Creamy spinach curry with soft paneer cubes',
      price: 260,
      preparationTime: 16,
      imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400',
      tags: ['veg', 'healthy'],
    },
    {
      name: 'Mutton Rogan Josh',
      description: 'Slow-braised mutton in Kashmiri spices — bold & aromatic',
      price: 420,
      preparationTime: 35,
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
      tags: ['non-veg', 'spicy', 'premium'],
    },
  ],

  'Breads': [
    {
      name: 'Butter Naan',
      description: 'Soft leavened bread baked in tandoor, brushed with butter',
      price: 50,
      preparationTime: 8,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
      tags: ['veg', 'popular'],
    },
    {
      name: 'Garlic Naan',
      description: 'Naan topped with fresh garlic and coriander',
      price: 65,
      preparationTime: 8,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
      tags: ['veg', 'popular'],
    },
    {
      name: 'Tandoori Roti',
      description: 'Whole wheat bread baked in a clay oven',
      price: 35,
      preparationTime: 6,
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
      tags: ['veg', 'healthy'],
    },
    {
      name: 'Paratha',
      description: 'Flaky whole wheat flatbread, pan-fried with ghee',
      price: 55,
      preparationTime: 8,
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
      tags: ['veg'],
    },
  ],

  'Rice & Biryani': [
    {
      name: 'Chicken Biryani',
      description: 'Fragrant basmati rice layered with spiced chicken — dum cooked',
      price: 360,
      preparationTime: 30,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400',
      tags: ['non-veg', 'popular', 'bestseller'],
    },
    {
      name: 'Veg Biryani',
      description: 'Aromatic rice with seasonal vegetables & whole spices',
      price: 270,
      preparationTime: 25,
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
      tags: ['veg', 'popular'],
    },
    {
      name: 'Mutton Biryani',
      description: 'Slow-cooked tender mutton in spiced saffron rice',
      price: 420,
      preparationTime: 40,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400',
      tags: ['non-veg', 'premium'],
    },
    {
      name: 'Jeera Rice',
      description: 'Steamed basmati rice tempered with cumin & ghee',
      price: 150,
      preparationTime: 12,
      imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400',
      tags: ['veg'],
    },
  ],

  'Beverages': [
    {
      name: 'Mango Lassi',
      description: 'Thick, chilled yogurt drink blended with fresh mango pulp',
      price: 120,
      preparationTime: 5,
      imageUrl: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400',
      tags: ['veg', 'cold', 'popular'],
    },
    {
      name: 'Masala Chai',
      description: 'Spiced Indian tea brewed with ginger, cardamom & milk',
      price: 60,
      preparationTime: 5,
      imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400',
      tags: ['veg', 'hot', 'popular'],
    },
    {
      name: 'Fresh Lime Soda',
      description: 'Chilled soda with freshly squeezed lime — sweet or salted',
      price: 80,
      preparationTime: 3,
      imageUrl: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=400',
      tags: ['veg', 'cold', 'refreshing'],
    },
    {
      name: 'Cold Coffee',
      description: 'Blended iced coffee with milk and a hint of vanilla',
      price: 130,
      preparationTime: 5,
      imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
      tags: ['veg', 'cold', 'popular'],
    },
    {
      name: 'Virgin Mojito',
      description: 'Mint, lime & soda — refreshing mocktail',
      price: 110,
      preparationTime: 5,
      imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400',
      tags: ['veg', 'cold'],
    },
    {
      name: 'Filter Coffee',
      description: 'South Indian decoction coffee with frothy milk',
      price: 70,
      preparationTime: 5,
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
      tags: ['veg', 'hot'],
    },
  ],

  'Desserts': [
    {
      name: 'Gulab Jamun',
      description: 'Soft milk-solid dumplings soaked in rose-flavoured sugar syrup',
      price: 100,
      preparationTime: 5,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
      tags: ['veg', 'sweet', 'popular'],
    },
    {
      name: 'Rasgulla',
      description: 'Spongy cottage cheese balls in light sugar syrup',
      price: 90,
      preparationTime: 5,
      imageUrl: 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=400',
      tags: ['veg', 'sweet'],
    },
    {
      name: 'Chocolate Brownie',
      description: 'Warm fudgy brownie served with a scoop of vanilla ice cream',
      price: 180,
      preparationTime: 8,
      imageUrl: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400',
      tags: ['veg', 'popular', 'bestseller'],
    },
    {
      name: 'Kulfi Falooda',
      description: 'Traditional Indian ice cream with rose syrup & vermicelli',
      price: 160,
      preparationTime: 5,
      imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400',
      tags: ['veg', 'cold', 'popular'],
    },
    {
      name: 'Phirni',
      description: 'Creamy ground rice pudding flavoured with cardamom & saffron',
      price: 120,
      preparationTime: 5,
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
      tags: ['veg', 'sweet'],
    },
  ],

  'Fast Food': [
    {
      name: 'Veg Burger',
      description: 'Crispy veggie patty with lettuce, tomato & special sauce',
      price: 140,
      preparationTime: 10,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      tags: ['veg', 'popular'],
    },
    {
      name: 'Chicken Burger',
      description: 'Juicy grilled chicken fillet with coleslaw & jalapeños',
      price: 200,
      preparationTime: 12,
      imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
      tags: ['non-veg', 'popular'],
    },
    {
      name: 'Margherita Pizza',
      description: 'Classic tomato base with mozzarella & fresh basil',
      price: 280,
      preparationTime: 18,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      tags: ['veg', 'popular', 'bestseller'],
    },
    {
      name: 'French Fries',
      description: 'Golden crispy potato fries seasoned with sea salt',
      price: 100,
      preparationTime: 8,
      imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400',
      tags: ['veg', 'popular'],
    },
    {
      name: 'Masala Sandwich',
      description: 'Toasted sandwich with spiced potato filling & green chutney',
      price: 110,
      preparationTime: 8,
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
      tags: ['veg'],
    },
  ],

  'Soups': [
    {
      name: 'Tomato Soup',
      description: 'Velvety tomato soup with cream and a hint of basil',
      price: 120,
      preparationTime: 10,
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
      tags: ['veg', 'hot', 'healthy'],
    },
    {
      name: 'Sweet Corn Soup',
      description: 'Thick, flavourful corn soup — veg or chicken',
      price: 130,
      preparationTime: 10,
      imageUrl: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400',
      tags: ['veg', 'hot'],
    },
    {
      name: 'Chicken Clear Soup',
      description: 'Light chicken broth with vegetables and black pepper',
      price: 150,
      preparationTime: 12,
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
      tags: ['non-veg', 'hot', 'healthy'],
    },
    {
      name: 'Hot & Sour Soup',
      description: 'Indo-Chinese style spicy & tangy broth with veggies',
      price: 140,
      preparationTime: 10,
      imageUrl: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400',
      tags: ['veg', 'spicy', 'popular'],
    },
  ],
};

const TABLES = [
  { tableNumber: 1, capacity: 2, location: 'indoor'  },
  { tableNumber: 2, capacity: 2, location: 'indoor'  },
  { tableNumber: 3, capacity: 4, location: 'indoor'  },
  { tableNumber: 4, capacity: 4, location: 'indoor'  },
  { tableNumber: 5, capacity: 4, location: 'indoor'  },
  { tableNumber: 6, capacity: 6, location: 'indoor'  },
  { tableNumber: 7, capacity: 6, location: 'outdoor' },
  { tableNumber: 8, capacity: 8, location: 'outdoor' },
  { tableNumber: 9, capacity: 4, location: 'private' },
  { tableNumber: 10, capacity: 10, location: 'private' },
];

const ADMIN_USER = {
  name: 'Admin User',
  email: 'admin@restaurant.com',
  password: 'admin123',
  role: 'admin',
};

// ─────────────────────────────────────────────
// SEED RUNNER
// ─────────────────────────────────────────────

const seed = async () => {
  console.log('\n🌱  Restaurant OMS — Seed Script');
  console.log('═══════════════════════════════════\n');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  MongoDB connected\n');

    // ── 1. Clear existing data ──────────────────
    console.log('🗑   Clearing existing data...');
    await Promise.all([
      Category.deleteMany({}),
      MenuItem.deleteMany({}),
      Table.deleteMany({}),
    ]);
    console.log('    Categories, MenuItems, Tables cleared.\n');

    // ── 2. Seed Categories ──────────────────────
    console.log('📂  Seeding categories...');
    const createdCategories = await Category.insertMany(CATEGORIES);
    const catMap = {};
    createdCategories.forEach((c) => { catMap[c.name] = c._id; });
    console.log(`    ✅  ${createdCategories.length} categories created.\n`);

    // ── 3. Seed Menu Items ──────────────────────
    console.log('🍽️   Seeding menu items...');
    const allItems = [];
    for (const [catName, items] of Object.entries(MENU_ITEMS_BY_CATEGORY)) {
      const catId = catMap[catName];
      if (!catId) {
        console.warn(`    ⚠️  Category not found: ${catName}`);
        continue;
      }
      items.forEach((item) => allItems.push({ ...item, category: catId }));
    }
    const createdItems = await MenuItem.insertMany(allItems);
    console.log(`    ✅  ${createdItems.length} menu items created.\n`);

    // ── 4. Seed Tables ──────────────────────────
    console.log('🪑  Seeding tables...');
    const createdTables = await Table.insertMany(TABLES);
    console.log(`    ✅  ${createdTables.length} tables created.\n`);

    // ── 5. Seed Admin User (skip if exists) ─────
    console.log('👤  Seeding admin user...');
    const existingAdmin = await User.findOne({ email: ADMIN_USER.email });
    if (existingAdmin) {
      console.log('    ⏭   Admin already exists — skipping.\n');
    } else {
      await User.create(ADMIN_USER);
      console.log('    ✅  Admin created.\n');
    }

    // ── Summary ─────────────────────────────────
    console.log('═══════════════════════════════════');
    console.log('🎉  Seeding complete!\n');
    console.log('📊  Summary:');
    console.log(`    • ${createdCategories.length} categories`);
    console.log(`    • ${createdItems.length} menu items`);
    console.log(`    • ${createdTables.length} tables`);
    console.log('    • 1 admin user\n');
    console.log('🔑  Admin Login:');
    console.log(`    Email:    ${ADMIN_USER.email}`);
    console.log(`    Password: ${ADMIN_USER.password}\n`);
    console.log('📂  Categories seeded:');
    CATEGORIES.forEach((c) => console.log(`    • ${c.name}`));
    console.log('\n🚀  Start the server: npm run dev\n');

  } catch (err) {
    console.error('\n❌  Seed failed:', err.message);
    if (err.code === 11000) {
      console.error('    Duplicate key error — some data already exists.');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌  MongoDB disconnected.');
    process.exit(0);
  }
};

seed();
