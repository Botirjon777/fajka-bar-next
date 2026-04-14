import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Manual env load for script context
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const CategorySchema = new mongoose.Schema({
  title: { pl: String, en: String },
  anchorId: String,
  image: String,
  order: Number,
});

const SubcategorySchema = new mongoose.Schema({
  title: { pl: String, en: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  order: Number,
});

const ProductSchema = new mongoose.Schema({
  name: { pl: String, en: String },
  desc: { pl: String, en: String },
  price: String,
  prices: [{ label: String, value: String }],
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
  order: Number,
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Subcategory = mongoose.models.Subcategory || mongoose.model('Subcategory', SubcategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await Admin.deleteMany({});
  await Category.deleteMany({});
  await Subcategory.deleteMany({});
  await Product.deleteMany({});

  // Create Admin
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPass, 10);
  await Admin.create({ username: adminUser, password: hashedPassword });
  console.log(`Admin created: ${adminUser}`);

  // Categories Setup
  const categoryData = [
    { title: { pl: 'SHISHA', en: 'SHISHA' }, anchorId: 'section-shisha', image: '/images/hookah.webp', order: 0 },
    { title: { pl: 'PIWO', en: 'BEER' }, anchorId: 'section-beer', image: '/images/drinks.webp', order: 1 },
    { title: { pl: 'WHISKY', en: 'WHISKY' }, anchorId: 'section-whiskey', image: '/images/drinks.webp', order: 2 },
    { title: { pl: 'SHOTY', en: 'SHOTS' }, anchorId: 'section-shots', image: '/images/drinks.webp', order: 3 },
    { title: { pl: 'KOKTAJLE', en: 'COCKTAILS' }, anchorId: 'section-cocktails', image: '/images/hero.webp', order: 4 },
    { title: { pl: 'ALKOHOL', en: 'ALCOHOL' }, anchorId: 'section-alcohol', image: '/images/drinks.webp', order: 5 },
    { title: { pl: 'MOBTEL', en: 'MOCKTAILS' }, anchorId: 'section-mocktails', image: '/images/hero.webp', order: 6 },
    { title: { pl: 'ZIMNE NAPOJE', en: 'COLD DRINKS' }, anchorId: 'section-cold-drinks', image: '/images/drinks.webp', order: 7 },
    { title: { pl: 'GORĄCE NAPOJE', en: 'HOT DRINKS' }, anchorId: 'section-hot-drinks', image: '/images/drinks.webp', order: 8 },
    { title: { pl: 'JEDZENIE', en: 'FOOD' }, anchorId: 'section-food', image: '/images/snacks.webp', order: 9 },
    { title: { pl: 'DESERY', en: 'DESSERTS' }, anchorId: 'section-desserts', image: '/images/snacks.webp', order: 10 },
  ];

  const createdCategories = {};
  for (const cat of categoryData) {
    const doc = await Category.create(cat);
    createdCategories[cat.anchorId] = doc;
  }
  console.log('Categories seeded');

  // Shisha Subcategories
  const shishaBrands = ['ADALYA', 'DARK SIDE', 'MUST HAVE', 'ELEMENT', 'BLACK BURN', 'SZISZA Z ALKOHOLEM'];
  const shishaEn = ['ADALYA', 'DARK SIDE', 'MUST HAVE', 'ELEMENT', 'BLACK BURN', 'SHISHA WITH ALCOHOL'];
  
  const createdShishaSubs = {};
  for (let i = 0; i < shishaBrands.length; i++) {
    const doc = await Subcategory.create({
      title: { pl: shishaBrands[i], en: shishaEn[i] },
      category: createdCategories['section-shisha']._id,
      order: i
    });
    createdShishaSubs[shishaBrands[i]] = doc;
  }

  // Shisha Products
  const shishaItems = [
    { brand: 'ADALYA', items: [{ name: 'Love 66', p: '100zł' }, { name: 'Lady Killer', p: '100zł' }, { name: 'Mango Tango', p: '100zł' }, { name: 'Hawaii', p: '100zł' }, { name: 'Berlin Nights', p: '100zł' }] },
    { brand: 'DARK SIDE', items: [{ name: 'Supernova', p: '120zł' }, { name: 'Bananapapa', p: '120zł' }, { name: 'Wildberry', p: '120zł' }, { name: 'Falling Star', p: '120zł' }, { name: 'Bounty Hunter', p: '120zł' }] },
    { brand: 'MUST HAVE', items: [{ name: 'Pinkman', p: '120zł' }, { name: 'Unicorn Treats', p: '120zł' }, { name: 'Milky Rice', p: '120zł' }, { name: 'Space Flavour', p: '120zł' }, { name: 'Kiwi Smoothie', p: '120zł' }] },
    { brand: 'ELEMENT', items: [{ name: 'Watermelon', p: '110zł' }, { name: 'Grapefruit', p: '110zł' }, { name: 'Thyme', p: '110zł' }, { name: 'Pear', p: '110zł' }, { name: 'Belgium Waffle', p: '110zł' }] },
    { brand: 'BLACK BURN', items: [{ name: 'Shock Iced Blueberry', p: '120zł' }, { name: 'Haribon', p: '120zł' }, { name: 'Papaya', p: '120zł' }, { name: 'Something Sweet', p: '120zł' }, { name: 'Famous Apple', p: '120zł' }] },
  ];

  for (const group of shishaItems) {
    for (const item of group.items) {
      await Product.create({
        name: { pl: item.name, en: item.name },
        price: item.p,
        category: createdCategories['section-shisha']._id,
        subcategory: createdShishaSubs[group.brand]._id,
        image: '/images/hookah.webp'
      });
    }
  }

  // Alcohol additions
  const shishaAdditions = [
    { name: { pl: 'Szisza z mlekiem', en: 'Shisha with milk' }, p: '+15zł' },
    { name: { pl: 'Szisza z winem', en: 'Shisha with wine' }, p: '+20zł' },
    { name: { pl: 'Szisza z wódką', en: 'Shisha with Vodka' }, p: '+15zł' },
    { name: { pl: 'Szisza z whisky', en: 'Shisha with Whisky' }, p: '+25zł' },
  ];
  for (const item of shishaAdditions) {
    await Product.create({
      name: item.name,
      price: item.p,
      category: createdCategories['section-shisha']._id,
      subcategory: createdShishaSubs['SZISZA Z ALKOHOLEM']._id,
      image: '/images/hookah.webp'
    });
  }

  // Beer
  const beerItems = [
    { name: 'Kasztelan Beczka 500ml', p: '15zł' },
    { name: 'Brooklyn Beczka 500ml', p: '17zł' },
    { name: 'Blanch 500ml', p: '22zł' },
    { name: 'Bosman 500ml', p: '18zł' },
    { name: 'Somersby', p: '18zł', d: { pl: 'Jabłko, Jeżyna, Mango, Arbuz', en: 'Apple, Blackberry, Mango, Watermelon' } },
    { name: 'Carlsberg 500ml', p: '18zł' },
    { name: 'Blanch 330ml', p: '18zł' },
    { name: 'Žatecký 500ml', p: '18zł' },
  ];
  for (const item of beerItems) {
    await Product.create({
      name: { pl: item.name, en: item.name },
      price: item.p,
      desc: item.d || { pl: '', en: '' },
      category: createdCategories['section-beer']._id,
      image: '/images/drinks.webp'
    });
  }

  // Whiskey
  const whiskeyItems = [
    { name: 'Jack Daniels 40ml', p: '30zł' },
    { name: 'Chivas Regal 40ml', p: '30zł' },
    { name: 'Jack Apple 40ml', p: '30zł' },
    { name: 'Jack Fire 40ml', p: '30zł' },
    { name: 'Jack Honey 40ml', p: '30zł' },
    { name: 'Jameson 40ml', p: '30zł' },
    { name: 'Red Label 40ml', p: '25zł' },
    { name: 'Jim Beam 40ml', p: '25zł' },
    { name: 'Ballantines 40ml', p: '25zł' },
  ];
  for (const item of whiskeyItems) {
     await Product.create({
      name: { pl: item.name, en: item.name },
      price: item.p,
      category: createdCategories['section-whiskey']._id,
      image: '/images/drinks.webp'
    });
  }

  // Shots
  const shotItems = [
    { name: 'Jäger 40ml', p: '15zł' },
    { name: 'Tequila 40ml', p: '15zł' },
    { name: 'Finlandia 40ml', p: '15zł' },
    { name: 'Kamikaze', prices: [{ label: '1 shot', value: '7zł' }, { label: '10 shot', value: '50zł' }] },
    { name: 'Soplica 40ml', p: '10zł' },
    { name: 'Frankenstein 40ml', p: '15zł' },
    { name: 'Sex on the beach Shot', prices: [{ label: '10 shot', value: '50zł' }] },
    { name: 'Mad Dog', prices: [{ label: '1 shot', value: '15zł' }, { label: '4 shot', value: '52zł' }] },
  ];
  for (const item of shotItems) {
    await Product.create({
      name: { pl: item.name, en: item.name },
      price: item.p,
      prices: item.prices,
      category: createdCategories['section-shots']._id,
      image: '/images/drinks.webp'
    });
  }

  // Fire Shots Subcategory
  const fireShotsSub = await Subcategory.create({
    title: { pl: 'FIRE SHOTS', en: 'FIRE SHOTS' },
    category: createdCategories['section-shots']._id,
    order: 1
  });

  const fireShotItems = [
    { name: 'Sambuka 40ml', p: '20zł' },
    { name: 'B-52 40ml', p: '20zł', d: { pl: 'Irish Cream, Kahlua, Triple Sec', en: 'Irish Cream, Kahlua, Triple Sec' } },
    { name: 'B-53 40ml', p: '20zł', d: { pl: 'Irish Cream, Kahlua, Absinthe', en: 'Irish Cream, Kahlua, Absinthe' } },
    { name: 'Absinthe 40ml', p: '20zł' },
    { name: 'Hiroshima 40ml', p: '20zł' },
  ];
  for (const item of fireShotItems) {
    await Product.create({
      name: { pl: item.name, en: item.name },
      price: item.p,
      desc: item.d,
      category: createdCategories['section-shots']._id,
      subcategory: fireShotsSub._id,
      image: '/images/drinks.webp'
    });
  }

  // Cocktails
  const cocktailItems = [
    { name: "Sex on the Beach", p: "30zł", d: "30ml wódka, 20ml likier brzoskwiniowy, sok pomarańczowy, grenadyna" },
    { name: "Sex on the Bar", p: "30zł", d: "30ml Malibu, 30ml wódka, sok pomarańczowy, sok ananasowy, grenadyna" },
    { name: "Pornstar Martini", p: "35zł", d: "45ml wódki waniliowej, 15ml likieru Passoa, syrop waniliowy, limonka" },
    { name: "Cosmopolitan", p: "30zł", d: "40ml wódka, 15ml triple sec, 15ml sok z limonki, 30ml sok żurawinowy" },
    { name: "Blue Lagoon", p: "30zł", d: "20ml wódka, 20ml tequila, 7 UP, blue curacao" },
    { name: "Mojito", p: "35zł", d: "40ml białego rumu, cukier, limonka, mieta, woda gazowana" },
    { name: "Aperol", p: "30zł", d: "Aperol spritz, Prosecco, Woda gazowana" },
    { name: "Jägerbomb", p: "30zł", d: "50ml Jägermeister, black Energy" },
    { name: "Jäger Lagoon", p: "30zł", d: "40ml Jäger, 7up, blue curacao" },
    { name: "Pina Colada", p: "30zł", d: "30ml malibu, 20ml rum, sok ananasowy, mleko" },
    { name: "Orgasm", p: "30zł", d: "20ml wódka, 20ml baileys, 15ml kahlua, mleko" },
    { name: "Blue Hawai", p: "30zł", d: "30ml blue curacao, 40ml wódka, 60ml sok ananasowy" },
    { name: "After Sex", p: "30zł", d: "30ml wódka, 20ml triple sec, 10ml syrop bananowy" },
    { name: "Long Island Ice Tea", p: "35zł" },
  ];
  for (const item of cocktailItems) {
    await Product.create({
      name: { pl: item.name, en: item.name },
      price: item.p,
      desc: { pl: item.d || '', en: item.d || '' },
      category: createdCategories['section-cocktails']._id,
      image: '/images/hero.webp'
    });
  }

  console.log('Database seeded successfully!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
