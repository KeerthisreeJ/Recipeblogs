const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const connectDB = require('../config/db');

dotenv.config();

const sampleUsers = [
  {
    name: 'Camille Laurent',
    email: 'camille@kittyeats.com',
    password: 'password123',
    bio: 'Pastry chef & food stylist living in Paris. Obsessed with flaky butter, vanilla beans, and slow Sunday brunches.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Mateo Rossi',
    email: 'mateo@kittyeats.com',
    password: 'password123',
    bio: 'Tuscan-raised home cook sharing authentic handmade pasta, heirloom pomodoro sauces, and olive oil secrets.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Sienna Miller',
    email: 'sienna@kittyeats.com',
    password: 'password123',
    bio: 'Holistic nutritionist crafting vibrant botanical bowls, clean comfort food, and guilt-free berry desserts.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
  }
];

const sampleRecipes = [
  {
    title: 'Velvety Burrata with Charred Strawberries & Basil Oil',
    description: 'An elevated appetizer pairing creamy Italian pugliese burrata with blistered balsamic-glazed strawberries, hand-torn purple basil, and a generous splash of Sicilian olive oil. Serve with warm crusty sourdough.',
    category: 'Breakfast',
    cookingTime: 20,
    servings: 4,
    image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      '2 balls fresh Italian Burrata (approx. 250g)',
      '300g ripe garden strawberries, hulled and halved',
      '2 tbsp aged Modena balsamic glaze',
      '1 tbsp raw blossom honey',
      '1 cup fresh holy basil leaves',
      '1/3 cup cold-pressed extra virgin olive oil',
      '1 tsp flaky Maldon sea salt',
      '1 loaf rustic sourdough, sliced and grilled'
    ],
    steps: [
      'Blanch the fresh basil in boiling water for 15 seconds, shock in ice water, then blend with extra virgin olive oil and a pinch of salt until silky emerald green. Strain through a fine mesh sieve.',
      'Heat a heavy cast iron skillet over medium-high heat. Toss strawberry halves with blossom honey and balsamic glaze. Sear for 2-3 minutes until charred on the edges yet juicy in the center.',
      'Tear burrata gently in the center of a shallow ceramic bowl. Spoon warm charred strawberries around the edges.',
      'Drizzle generously with bright basil oil, sprinkle flaky sea salt, cracked black pepper, and serve immediately alongside warm toasted sourdough.'
    ]
  },
  {
    title: 'Handcrafted Truffle Cacio e Pepe Tagliolini',
    description: 'The iconic Roman classic taken to fine-dining heights. Fresh golden egg tagliolini emulsified with aged Pecorino Romano, toasted Kampot peppercorns, and shaved black winter truffles.',
    category: 'Pasta',
    cookingTime: 25,
    servings: 2,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      '300g fresh egg tagliolini or fettuccine',
      '150g Pecorino Romano DOP, finely microplaned',
      '1.5 tbsp whole black peppercorns (freshly cracked)',
      '2 tbsp grass-fed unsalted butter',
      'Fresh black truffle for shaving (or truffle oil infusion)',
      'Coarse sea salt for pasta water'
    ],
    steps: [
      'Bring a pot of salted water to a gentle rolling boil. Drop fresh tagliolini and cook for just 2 to 3 minutes until al dente.',
      'In a wide skillet, dry-toast the freshly crushed black peppercorns over medium heat until fragrant (about 90 seconds). Melt in butter with half a ladle of starchy pasta water.',
      'In a mixing bowl, blend microplaned Pecorino Romano with a splash of warm pasta water using a whisk until a smooth, glossy cheese cream forms.',
      'Transfer pasta directly into the pepper butter skillet, remove from direct heat, fold in the cheese paste vigorously until luxurious and creamy.',
      'Plate into warmed bowls, finish with fresh black pepper and delicate paper-thin shavings of black truffle.'
    ]
  },
  {
    title: 'Rosewater & Pistachio French Macarons with White Chocolate Ganache',
    description: 'Delicate pastel pink macaron shells infused with natural Damask rose essence, filled with silky whipped white chocolate ganache and rolled in crunchy Iranian emerald pistachios.',
    category: 'Dessert',
    cookingTime: 55,
    servings: 12,
    image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      '100g finely sifted almond flour',
      '100g powdered confectioners sugar',
      '75g aged egg whites at room temperature',
      '75g superfine granulated sugar',
      '1 tsp organic rosewater essence',
      '2 drops natural pink beetroot dye',
      '150g Valrhona white chocolate',
      '80ml heavy whipping cream (35%)',
      '40g finely chopped raw pistachios'
    ],
    steps: [
      'Sift almond flour and confectioners sugar twice to ensure a featherweight texture without clumps.',
      'Whip egg whites into soft peaks, gradually stream in granulated sugar while continuing to whip into stiff, glossy French meringue. Gently fold in rosewater and pink coloring.',
      'Perform the macaronage technique: fold dry ingredients into meringue with a silicone spatula until batter flows like ribbon lava.',
      'Pipe into 1.5-inch rounds onto parchment-lined baking sheets. Tap tray firmly against the counter and let sit 30 minutes to form a dry skin.',
      'Bake at 300°F (150°C) for 14 minutes until ruffled feet emerge. Cool completely, pipe with white chocolate ganache, and roll edges in crushed pistachios.'
    ]
  },
  {
    title: 'Wild Hibiscus & Ruby Grapefruit Spritz',
    description: 'A sparkling, refreshing sunset aperitivo. Brewed Egyptian hibiscus blossoms, freshly squeezed ruby grapefruit juice, artisanal elderflower liqueur, and chilled prosecco.',
    category: 'Drinks',
    cookingTime: 10,
    servings: 2,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      '200ml chilled dry Italian Prosecco',
      '60ml artisanal Elderflower liqueur (St-Germain)',
      '100ml freshly squeezed ruby grapefruit juice',
      '60ml concentrated cold-brewed hibiscus tea',
      '2 wild hibiscus flowers in syrup',
      'Fresh rosemary sprigs & grapefruit wheels',
      'Hand-cut clear ice cubes'
    ],
    steps: [
      'Brew hibiscus flowers with boiling water and a touch of agave syrup, then chill completely.',
      'Fill large wine goblets with artisanal clear ice cubes.',
      'Pour elderflower liqueur, freshly squeezed grapefruit juice, and hibiscus tea over the ice.',
      'Top with bubbly prosecco, stir gently once from the bottom, and garnish with a ruby grapefruit slice and a torched rosemary sprig.'
    ]
  },
  {
    title: 'Whipped Ricotta Tartine with Heirloom Figs & Hot Honey',
    description: 'Crisp artisan sourdough rubbed with garlic, smothered in velvety lemon-thyme whipped ricotta, topped with mission figs, toasted walnuts, and spicy habanero blossom honey.',
    category: 'Breakfast',
    cookingTime: 15,
    servings: 2,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      '2 thick slices rustic sourdough country bread',
      '200g whole milk sheep ricotta',
      '1 tbsp heavy cream',
      'Zest of 1 organic Meyer lemon',
      '4 ripe black mission figs, quartered',
      '2 tbsp raw spicy hot chili honey',
      '2 tbsp toasted crushed walnuts',
      'Fresh lemon thyme leaves & sea salt'
    ],
    steps: [
      'In a food processor, blend whole milk ricotta, heavy cream, lemon zest, and a pinch of salt for 2 minutes until cloud-like and airy.',
      'Brush sourdough slices with olive oil and toast on a skillet or grill until golden brown and crackly.',
      'Slather generous swirls of whipped ricotta across the warm toasted bread.',
      'Arrange fig quarters artistically on top, scatter toasted walnuts, and drizzle liberally with hot chili honey.'
    ]
  },
  {
    title: 'Pan-Seared Duck Breast with Spiced Cherry Reduction',
    description: 'Crispy golden scored duck breast cooked to juicy medium-rare perfection, paired with a luscious sauce made from dark cherries, port wine, shallots, and fragrant star anise.',
    category: 'Dinner',
    cookingTime: 35,
    servings: 2,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      '2 boneless duck breasts (skin-on)',
      '1.5 cups fresh dark sweet cherries (pitted)',
      '1 cup ruby port wine or full-bodied Pinot Noir',
      '1 finely diced French shallot',
      '1 star anise & 1 cinnamon quill',
      '2 tbsp cold unsalted butter (cubed)',
      '2 sprigs fresh thyme',
      'Flaky salt and cracked tellicherry pepper'
    ],
    steps: [
      'Score the duck breast skin in a tight diamond pattern without slicing into the meat. Season generously with salt and pepper.',
      'Place duck skin-side down in a cold stainless steel pan over medium-low heat. Slowly render the fat for 10-12 minutes until deep golden and crisp.',
      'Flip duck and sear the flesh side for 3-4 minutes for medium-rare. Transfer to a wooden board and rest for 8 minutes.',
      'Pour off excess duck fat (reserve for roasting potatoes). Sauté shallots in the pan, add port wine, dark cherries, star anise, and thyme. Simmer until syrupy.',
      'Remove from heat, swirl in cold butter to create a glossy emulsion. Slice duck against the grain and spoon cherry reduction overtop.'
    ]
  }
];

const seedDB = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Recipe.deleteMany({});

    console.log('Seeding users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users.`);

    console.log('Seeding recipes...');
    for (let i = 0; i < sampleRecipes.length; i++) {
      const author = createdUsers[i % createdUsers.length];
      const otherUsers = createdUsers.filter((u) => u._id.toString() !== author._id.toString());

      const recipe = await Recipe.create({
        ...sampleRecipes[i],
        author: author._id,
        likes: [otherUsers[0]._id],
        savedBy: [otherUsers[0]._id]
      });

      await User.findByIdAndUpdate(otherUsers[0]._id, {
        $push: { savedRecipes: recipe._id }
      });
    }

    console.log('Seeding complete! Kittyeats is stocked with high-end food content.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
