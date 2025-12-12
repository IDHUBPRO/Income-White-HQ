// functions.js — সব পেজে <script src="config.js"></script> তারপর <script src="functions.js"></script> দিবে

// লগইন চেক — যদি লগইন না থাকে তাহলে login.html এ পাঠাবে
function checkLogin() {
  if (!localStorage.getItem('isLoggedIn') || localStorage.getItem('isLoggedIn') !== 'true') {
    location.href = 'login.html';
  }
}

// লগআউট
function logout() {
  localStorage.clear();
  location.href = 'index.html';
}

// ইউজারের ডাটা নিয়ে আসা (আপডেটেড)
async function getCurrentUser() {
  const stored = localStorage.getItem('currentUser');
  if (!stored) {
    logout();
    return null;
  }
  const user = JSON.parse(stored);
  if (!user.$id) {
    logout();
    return null;
  }
  try {
    const doc = await db.getDocument(DATABASE_ID, COL.users, user.$id);
    localStorage.setItem('currentUser', JSON.stringify(doc));
    return doc;
  } catch (e) {
    console.error("ইউজার লোড করতে সমস্যা:", e);
    logout();
    return null;
  }
}

// মোট উইথড্র করার যোগ্য ব্যালেন্স ক্যালকুলেট
function calculateBalance(user) {
  return (user.task_balance || 0) +
         (user.random_balance || 0) +
         (user.refer_balance || 0) +
         (user.premium_balance || 0);
}

// নাম্বার ফরম্যাট (1,234)
function formatNumber(num) {
  return Number(num || 0).toLocaleString('en-IN');
}

// তারিখ ফরম্যাট (বাংলা)
function formatDate(date) {
  return new Date(date).toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  });
}

// সুন্দর নোটিফিকেশন (সাউন্ড সহ!)
function showNotification(message, type = 'info') {
  const colors = {
    success: '#00c853',
    error: '#ff1744',
    info: '#00d4ff',
    warning: '#ff9800'
  };
  const icons = {
    success: 'check-circle',
    error: 'exclamation-triangle',
    info: 'info-circle',
    warning: 'exclamation-circle'
  };

  const div = document.createElement('div');
  div.style.cssText = `
    position:fixed;top:20px;right:20px;background:${colors[type]};color:#fff;
    padding:18px 28px;border-radius:16px;z-index:99999;font-size:18px;font-weight:bold;
    box-shadow:0 15px 40px rgba(0,0,0,0.5);animation:slideIn 0.5s, slideOut 0.5s 4s forwards;
    display:flex;align-items:center;gap:12px;max-width:400px;word-wrap:break-word;
  `;
  div.innerHTML = `<i class="fas fa-\( {icons[type]} fa-2x"></i> \){message}`;
  document.body.appendChild(div);

  // সাউন্ড ইফেক্ট (অপশনাল)
  try {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3');
    audio.volume = 0.3;
    if (type === 'success') audio.play();
  } catch(e) {}

  setTimeout(() => div.remove(), 5000);
}

// অ্যানিমেশন
const style = document.createElement('style');
style.innerHTML = `
@keyframes slideIn{from{transform:translateX(120%) scale(0.8);opacity:0}to{transform:translateX(0) scale(1);opacity:1}}
@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(120%);opacity:0}}
`;
document.head.appendChild(style);

// সব পেজে এই ফাইল ইমপোর্ট করলেই হবে — কাজ শেষ!