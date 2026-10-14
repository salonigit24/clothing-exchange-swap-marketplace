const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Clothing = require('../models/Clothing');
const SwapRequest = require('../models/SwapRequest');
const Message = require('../models/Message');
const SavedItem = require('../models/SavedItem');
const Report = require('../models/Report');

const { usersData, clothesData } = require('./seedData');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/clothing_swap_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing old database records...');
    await Promise.all([
      User.deleteMany(),
      Clothing.deleteMany(),
      SwapRequest.deleteMany(),
      Message.deleteMany(),
      SavedItem.deleteMany(),
      Report.deleteMany()
    ]);

    console.log('Seeding Users...');
    // Create users individually to trigger pre-save bcrypt hook
    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users (including Admin).`);

    console.log('Seeding Clothing listings...');
    const createdClothes = [];
    for (const item of clothesData) {
      const owner = createdUsers[item.userIndex || 1];
      const clothing = await Clothing.create({
        owner: owner._id,
        title: item.title,
        category: item.category,
        type: item.type,
        brand: item.brand,
        size: item.size,
        gender: item.gender,
        color: item.color,
        condition: item.condition,
        description: item.description,
        originalPrice: item.originalPrice,
        estimatedSwapValue: item.estimatedSwapValue,
        images: item.images,
        city: item.city || owner.city,
        state: item.state || owner.state,
        status: item.status || 'Available'
      });
      createdClothes.push(clothing);
    }
    console.log(`Created ${createdClothes.length} clothing items.`);

    console.log('Seeding Realistic Swaps and Negotiations...');

    // Swap 1: Pending (Aarav offers Levi's Jacket to Rohan for Zara Shirt)
    const swap1 = await SwapRequest.create({
      requester: createdUsers[1]._id, // Aarav (Mumbai)
      owner: createdUsers[3]._id,     // Rohan (Nagpur)
      offeredItem: createdClothes[0]._id, // Levi's Jacket
      requestedItem: createdClothes[2]._id, // Zara Shirt
      offeredValue: createdClothes[0].estimatedSwapValue,
      requestedValue: createdClothes[2].estimatedSwapValue,
      message: 'Hi Rohan! I would love to swap my Levi\'s denim trucker jacket for your linen shirt.',
      status: 'Pending'
    });

    await Message.create({
      swapRequest: swap1._id,
      sender: createdUsers[1]._id,
      receiver: createdUsers[3]._id,
      message: 'Hi Rohan! I would love to swap my Levi\'s denim trucker jacket for your linen shirt.'
    });

    // Swap 2: Negotiating / Accepted (Priya and Vikram)
    const swap2 = await SwapRequest.create({
      requester: createdUsers[2]._id, // Priya (Pune)
      owner: createdUsers[5]._id,     // Vikram (Delhi)
      offeredItem: createdClothes[1]._id, // Floral dress
      requestedItem: createdClothes[9]._id, // Zara Overcoat
      offeredValue: createdClothes[1].estimatedSwapValue,
      requestedValue: createdClothes[9].estimatedSwapValue,
      message: 'Hi Vikram! Would you be okay exchanging this houndstooth coat for my floral dress?',
      status: 'Accepted'
    });

    await Message.create([
      {
        swapRequest: swap2._id,
        sender: createdUsers[2]._id,
        receiver: createdUsers[5]._id,
        message: 'Hi Vikram! Would you be okay exchanging this houndstooth coat for my floral dress?'
      },
      {
        swapRequest: swap2._id,
        sender: createdUsers[5]._id,
        receiver: createdUsers[2]._id,
        message: 'Hello Priya! That dress looks lovely. Can you confirm if it has the inner lining?'
      },
      {
        swapRequest: swap2._id,
        sender: createdUsers[2]._id,
        receiver: createdUsers[5]._id,
        message: 'Yes, 100% fine cotton lining, very comfortable!'
      },
      {
        swapRequest: swap2._id,
        sender: createdUsers[5]._id,
        receiver: createdUsers[2]._id,
        message: 'Great! I am happy to accept this swap. Let\'s coordinate courier shipping.'
      }
    ]);

    // Swap 3: Confirmed Local Swap in Nagpur (Rohan & Tanvi)
    const swap3 = await SwapRequest.create({
      requester: createdUsers[3]._id, // Rohan (Nagpur)
      owner: createdUsers[8]._id,     // Tanvi (Nagpur)
      offeredItem: createdClothes[3]._id, // Nike Hoodie
      requestedItem: createdClothes[4]._id, // Roadster Jeans
      offeredValue: createdClothes[3].estimatedSwapValue,
      requestedValue: createdClothes[4].estimatedSwapValue,
      message: 'Hey Tanvi, both of us are in Nagpur! We can do a quick local exchange at Dharampeth.',
      status: 'Confirmed',
      exchangeMethod: 'Local Exchange',
      requesterConfirmed: true,
      ownerConfirmed: true
    });

    await Message.create([
      {
        swapRequest: swap3._id,
        sender: createdUsers[3]._id,
        receiver: createdUsers[8]._id,
        message: 'Hey Tanvi, both of us are in Nagpur! We can do a quick local exchange at Dharampeth.'
      },
      {
        swapRequest: swap3._id,
        sender: createdUsers[8]._id,
        receiver: createdUsers[3]._id,
        message: 'Sounds perfect! Saturday 4 PM works for me.'
      }
    ]);

    // Swap 4: Completed Swap (Marked Swapped)
    const swap4 = await SwapRequest.create({
      requester: createdUsers[4]._id, // Ananya
      owner: createdUsers[6]._id,     // Sneha
      offeredItem: createdClothes[6]._id, // FabIndia Kurti
      requestedItem: createdClothes[12]._id, // Raymond Trousers
      offeredValue: createdClothes[6].estimatedSwapValue,
      requestedValue: createdClothes[12].estimatedSwapValue,
      message: 'Completed successful swap exchange via BlueDart courier.',
      status: 'Completed',
      exchangeMethod: 'Courier/Shipping',
      requesterConfirmed: true,
      ownerConfirmed: true,
      requesterCompleted: true,
      ownerCompleted: true
    });

    // Mark the items of Swap 4 as 'Swapped'
    await Clothing.findByIdAndUpdate(createdClothes[6]._id, { status: 'Swapped' });
    await Clothing.findByIdAndUpdate(createdClothes[12]._id, { status: 'Swapped' });

    console.log('Seeding Saved Items...');
    await SavedItem.create([
      { user: createdUsers[1]._id, clothing: createdClothes[1]._id },
      { user: createdUsers[1]._id, clothing: createdClothes[2]._id },
      { user: createdUsers[2]._id, clothing: createdClothes[0]._id },
      { user: createdUsers[3]._id, clothing: createdClothes[7]._id }
    ]);

    console.log('Seeding Reports for Admin Moderation...');
    await Report.create([
      {
        reporter: createdUsers[1]._id,
        reportedUser: createdUsers[7]._id,
        reason: 'Spam',
        description: 'Repeatedly sends identical swap requests and does not respond in chat.',
        status: 'Pending'
      },
      {
        reporter: createdUsers[2]._id,
        clothing: createdClothes[4]._id,
        reason: 'Wrong information',
        description: 'The waist size is listed as 32 but picture tag seems to show 34.',
        status: 'Reviewing',
        adminResponse: 'We have messaged the owner to verify size label and re-upload photo.'
      }
    ]);

    console.log('\n===========================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('===========================================');
    console.log('Admin Account:');
    console.log('  Email:    admin@swapwear.com');
    console.log('  Password: Admin@123');
    console.log('\nDemo User Accounts (Sample):');
    console.log('  1. aarav.sharma@example.com   | Pass: User@123 | Mumbai');
    console.log('  2. priya.patel@example.com    | Pass: User@123 | Pune');
    console.log('  3. rohan.mehta@example.com    | Pass: User@123 | Nagpur');
    console.log('  4. ananya.iyer@example.com    | Pass: User@123 | Bengaluru');
    console.log('===========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
