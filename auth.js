// auth.js — শুধু login.html এবং register.html এ ইমপোর্ট করবে
// <script src="config.js"></script>
// <script src="functions.js"></script>
// <script src="auth.js"></script>

async function register() {
  const first = document.getElementById('firstName').value.trim();
  const last = document.getElementById('lastName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const username = document.getElementById('username').value.trim().toLowerCase();
  const pass = document.getElementById('password').value;
  const cpass = document.getElementById('cpassword')?.value || document.getElementById('cpass')?.value;
  const referInput = document.getElementById('referCode')?.value.trim().toLowerCase() || '';

  // ভ্যালিডেশন
  if (!first || !last || !phone || !username || !pass || !cpass) {
    return showNotification('সব ফিল্ড পূরণ করো!', 'error');
  }
  if (pass !== cpass) {
    return showNotification('পাসওয়ার্ড মিলছে না!', 'error');
  }
  if (pass.length < 6) {
    return showNotification('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে!', 'error');
  }
  if (!/^01[3-9][0-9]{8}$/.test(phone)) {
    return showNotification('সঠিক ১১ ডিজিটের মোবাইল নাম্বার দাও!', 'error');
  }

  try {
    // ডুপ্লিকেট চেক
    const check = await db.listDocuments(DATABASE_ID, COL.users, [
      Appwrite.Query.or([
        Appwrite.Query.equal('username', username),
        Appwrite.Query.equal('phone', phone)
      ])
    ]);
    if (check.total > 0) {
      return showNotification('ইউজারনেম বা ফোন নাম্বার আগে থেকে আছে!', 'error');
    }

    // রেফার চেক
    let referBy = null;
    let referBonus = 50; // ডিফল্ট বোনাস
    if (referInput) {
      const refCheck = await db.listDocuments(DATABASE_ID, COL.users, [
        Appwrite.Query.equal('username', referInput)
      ]);
      if (refCheck.total === 0) {
        return showNotification('রেফার কোড ভুল!', 'error');
      }
      referBy = referInput;
      referBonus = 100; // রেফার থাকলে ১০০ HQ
    }

    // নতুন ইউজার তৈরি
    const newUser = await db.createDocument(DATABASE_ID, COL.users, 'unique()', {
      first_name: first,
      last_name: last,
      phone,
      username,
      password: pass,
      refer_by: referBy,
      task_balance: referBonus,
      random_balance: 0,
      refer_balance: 0,
      premium_balance: 0,
      deposit_balance: 0,
      is_premium: false,
      premium_package: 0
    });

    // রেফার বোনাস দাও
    if (referBy) {
      const refUser = refCheck.documents[0];
      await db.updateDocument(DATABASE_ID, COL.users, refUser.$id, {
        refer_balance: (refUser.refer_balance || 0) + 100
      });
    }

    showNotification(`অভিনন্দন! রেজিস্ট্রেশন সফল। ${referBonus} HQ বোনাস যোগ হয়েছে!`, 'success');
    setTimeout(() => location.href = 'login.html', 1500);

  } catch (e) {
    showNotification('সমস্যা: ' + e.message, 'error');
  }
}

async function login() {
  const identifier = document.getElementById('identifier')?.value.trim() || document.getElementById('username')?.value.trim();
  const pass = document.getElementById('pass')?.value || document.getElementById('password')?.value;

  if (!identifier || !pass) {
    return showNotification('ইউজারনেম/মোবাইল ও পাসওয়ার্ড দাও!', 'error');
  }

  try {
    // ইউজার খোঁজো
    const res = await db.listDocuments(DATABASE_ID, COL.users, [
      Appwrite.Query.or([
        Appwrite.Query.equal('username', identifier.toLowerCase()),
        Appwrite.Query.equal('phone', identifier)
      ])
    ]);

    if (res.total === 0) {
      return showNotification('ইউজার পাওয়া যায়নি!', 'error');
    }

    const user = res.documents[0];
    if (user.password !== pass) {
      return showNotification('পাসওয়ার্ড ভুল!', 'error');
    }

    // সফল লগইন
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));

    showNotification(`স্বাগতম ${user.first_name || user.username}!`, 'success');
    setTimeout(() => location.href = 'dashboard.html', 1000);

  } catch (e) {
    showNotification('লগইন সমস্যা: ' + e.message, 'error');
  }
}

// সুপার এডমিন লগইন (যদি প্রয়োজন হয়)
if (window.location.pathname.includes('admin.html')) {
  // admin.html এর জন্য আলাদা লগইন থাকবে
}