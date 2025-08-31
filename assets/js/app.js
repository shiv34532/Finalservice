/* LocalStorage Database Simulation */
let db = {
  users: JSON.parse(localStorage.getItem("users") || "[]"),
  messages: JSON.parse(localStorage.getItem("messages") || "[]"),
  media: JSON.parse(localStorage.getItem("media") || "[]")
};

function saveDB() {
  localStorage.setItem("users", JSON.stringify(db.users));
  localStorage.setItem("messages", JSON.stringify(db.messages));
  localStorage.setItem("media", JSON.stringify(db.media));
}

/* Navigation */
function showSection(id) {
  document.querySelectorAll(".content-section").forEach(s => s.classList.add("d-none"));
  document.getElementById(id).classList.remove("d-none");
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  document.querySelector(`[onclick="showSection('${id}')"]`)?.classList.add("active");
}

/* Contact Form */
function submitContactForm(e) {
  e.preventDefault();
  const msg = {
    id: db.messages.length + 1,
    name: document.getElementById("firstName").value + " " + document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
    created_at: new Date().toLocaleString()
  };
  db.messages.push(msg);
  saveDB();
  alert("Message stored locally!");
  document.getElementById("contactForm").reset();
  renderMessages();
}

/* Signup */
function registerUser(e) {
  e.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const pass = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("confirmPassword").value;
  if (pass !== confirm) return alert("Passwords do not match");

  if (db.users.find(u => u.email === email)) {
    return alert("Email already exists!");
  }
  db.users.push({id: db.users.length+1, name, email, role:"user", created_at: new Date().toLocaleString()});
  saveDB();
  alert("Account created (stored locally)");
  bootstrap.Modal.getInstance(document.getElementById("signupModal")).hide();
  document.getElementById("signupForm").reset();
  renderUsers();
}

/* Admin Login */
function adminLogin(e) {
  e.preventDefault();
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;
  // Static demo: any login works if email exists
  if (db.users.find(u => u.email === email) || email === "admin@example.com") {
    bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
    showSection("admin");
    renderUsers();
    renderMessages();
    alert("Logged in (demo)");
  } else {
    alert("Invalid login");
  }
}

/* Render functions */
function renderUsers() {
  const list = document.getElementById("usersList");
  list.innerHTML = "";
  db.users.forEach(u => {
    list.innerHTML += `<div class="p-2 border rounded">${u.name} (${u.email}) • ${u.role}</div>`;
  });
  document.getElementById("totalUsers").textContent = db.users.length;
}
function renderMessages() {
  const list = document.getElementById("messagesList");
  list.innerHTML = "";
  db.messages.forEach(m => {
    list.innerHTML += `<div class="border-bottom pb-2 mb-2">
      <strong>${m.name}</strong> <small>${m.created_at}</small><br>
      <span class="text-muted">${m.email} • ${m.subject}</span><br>
      ${m.message}
    </div>`;
  });
  document.getElementById("totalMessages").textContent = db.messages.length;
}

/* Media Upload Simulation */
function uploadMedia(e) {
  e.preventDefault();
  const file = document.getElementById("mediaFile").files[0];
  if (!file) return;
  const obj = {id: db.media.length+1, filename:file.name, mime:file.type, created_at:new Date().toLocaleString()};
  db.media.push(obj);
  saveDB();
  listMedia();
}
function listMedia() {
  const g = document.getElementById("mediaList");
  g.innerHTML = "";
  db.media.forEach(m => {
    g.innerHTML += `<div class="col"><div class="p-2 border small">${m.filename}<br><span class="text-muted">${m.mime}</span></div></div>`;
  });
}

/* Init */
document.addEventListener("DOMContentLoaded", () => {
  showSection("home");
  renderUsers();
  renderMessages();
  listMedia();
});
