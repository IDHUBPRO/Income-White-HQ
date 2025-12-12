// config.js — সব পেজে প্রথমে এই ফাইল ইমপোর্ট করবে: <script src="config.js"></script>

// Appwrite কানেকশন সেটিংস
const APPWRITE_ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '6931024b0037bd66bcb4';
const DATABASE_ID = 'main';

// সব কালেকশনের আইডি এক জায়গায় (যেকোনো পেজে COL.users দিয়ে ব্যবহার করবে)
const COL = {
  users: 'users',
  deposits: 'deposits',
  withdraw_requests: 'withdraw_requests',
  regular_tasks: 'regular_tasks',
  regular_submissions: 'regular_submissions',
  premium_ads_log: 'premium_ads_log',
  transactions: 'transactions',
  notice: 'notice'  // যদি নোটিস কালেকশন বানাও
};

// Appwrite ক্লায়েন্ট তৈরি (সব পেজে এই db ব্যবহার করবে)
const client = new Appwrite.Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

const db = new Appwrite.Databases(client);

// ভবিষ্যতে নতুন কালেকশন যোগ করলে শুধু COL এ যোগ করলেই হবে
// উদাহরণ: COL.new_collection = 'new_collection_id';

// কনফিগ লোড হয়েছে কিনা চেক (ডিবাগের জন্য)
console.log("Config.js লোড হয়েছে | প্রজেক্ট:", APPWRITE_PROJECT_ID);