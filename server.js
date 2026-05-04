const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

// ===== DATABASE =====
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));
}

// ===== MODELS =====
const Menu = mongoose.model("Menu", {
  name: String,
  price: Number
});

const Review = mongoose.model("Review", {
  name: String,
  text: String
});

// ===== ADMIN =====
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true });
  }
  res.status(403).json({ success: false });
});

// ===== MENU =====
app.get("/api/menu", async (req, res) => {
  const data = await Menu.find();
  res.json(data);
});

app.post("/api/menu", async (req, res) => {
  const item = new Menu(req.body);
  await item.save();
  res.send("Added");
});

// ===== REVIEWS =====
app.get("/api/reviews", async (req, res) => {
  const data = await Review.find();
  res.json(data);
});

app.post("/api/reviews", async (req, res) => {
  const review = new Review(req.body);
  await review.save();
  res.send("Review added");
});

// ===== FRONTEND =====
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>1016 Cafe</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>
body {
  margin:0;
  font-family: 'Segoe UI', sans-serif;
  background:#0a0a0a;
  color:white;
}

.hero {
  height:80vh;
  display:flex;
  justify-content:center;
  align-items:center;
  background:url('https://images.unsplash.com/photo-1509042239860-f550ce710b93') center/cover;
  position:relative;
}

.hero::after {
  content:'';
  position:absolute;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.6);
}

.hero-content {
  position:relative;
  text-align:center;
}

.section {
  padding:50px 20px;
}

.grid {
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
  gap:20px;
}

.card {
  background:rgba(255,255,255,0.05);
  padding:20px;
  border-radius:15px;
  backdrop-filter: blur(10px);
  transition:0.3s;
}

.card:hover {
  transform:translateY(-5px);
}

input, button {
  padding:10px;
  margin:5px;
  border:none;
  border-radius:8px;
}

button {
  background:#c59d5f;
  color:white;
  cursor:pointer;
}
</style>
</head>

<body>

<div class="hero">
  <div class="hero-content">
    <h1>1016 Cafe ☕</h1>
    <p>Premium Coffee Experience</p>
  </div>
</div>

<div class="section">
<h2>Menu</h2>
<div id="menu" class="grid"></div>
</div>

<div class="section">
<h2>Reviews</h2>
<div id="reviews" class="grid"></div>

<br>
<input id="rname" placeholder="Your name">
<input id="rtext" placeholder="Your review">
<button onclick="addReview()">Submit</button>
</div>

<script>
fetch('/api/menu')
.then(r=>r.json())
.then(d=>{
  const el=document.getElementById('menu');
  el.innerHTML='';
  d.forEach(i=>{
    el.innerHTML += \`
      <div class="card">
        <h3>\${i.name}</h3>
        <p>$\${i.price}</p>
      </div>
    \`;
  });
});

fetch('/api/reviews')
.then(r=>r.json())
.then(d=>{
  const el=document.getElementById('reviews');
  el.innerHTML='';
  d.forEach(i=>{
    el.innerHTML += \`
      <div class="card">
        <strong>\${i.name}</strong>
        <p>\${i.text}</p>
      </div>
    \`;
  });
});

function addReview(){
  fetch('/api/reviews',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      name:document.getElementById('rname').value,
      text:document.getElementById('rtext').value
    })
  }).then(()=>location.reload());
}
</script>

</body>
</html>
`);
});

// ===== ADMIN PANEL =====
app.get("/admin", (req, res) => {
  res.send(`
<h2>Admin Panel</h2>
<input id="name" placeholder="Coffee">
<input id="price" placeholder="Price">
<button onclick="add()">Add</button>

<script>
function add(){
  fetch('/api/menu',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      name:document.getElementById('name').value,
      price:document.getElementById('price').value
    })
  }).then(()=>alert("Added"));
}
</script>
`);
});

// ===== START =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
