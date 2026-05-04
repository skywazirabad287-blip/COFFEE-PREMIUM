const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

// ===== CONNECT DB =====
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

// ===== MODELS =====
const Menu = mongoose.model("Menu", {
  name: String,
  price: Number
});

const Review = mongoose.model("Review", {
  name: String,
  text: String
});

// ===== ADMIN LOGIN =====
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
  res.send("Saved");
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
<style>
body { background:#111; color:white; font-family:sans-serif; }
.section { padding:40px; }
.card { background:#222; padding:15px; margin:10px; border-radius:10px; }
</style>
</head>
<body>

<h1>1016 Cafe ☕</h1>

<div class="section">
<h2>Menu</h2>
<div id="menu"></div>
</div>

<div class="section">
<h2>Reviews</h2>
<div id="reviews"></div>

<input id="rname" placeholder="Your name">
<input id="rtext" placeholder="Your review">
<button onclick="addReview()">Submit</button>
</div>

<script>
fetch('/api/menu')
.then(r=>r.json())
.then(d=>{
  const el=document.getElementById('menu');
  d.forEach(i=>{
    el.innerHTML += '<div class="card">'+i.name+' - $'+i.price+'</div>';
  });
});

fetch('/api/reviews')
.then(r=>r.json())
.then(d=>{
  const el=document.getElementById('reviews');
  d.forEach(i=>{
    el.innerHTML += '<div class="card">'+i.name+': '+i.text+'</div>';
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

// ===== ADMIN =====
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

app.listen(process.env.PORT || 3000);
