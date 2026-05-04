const express = require("express");
const app = express();

app.use(express.json());

// ===== DATA =====
let menu = [
  { name: "Latte", price: 4 },
  { name: "Banoffee Latte", price: 5 },
  { name: "Matcha", price: 4 }
];

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

// ===== API =====
app.get("/api/menu", (req, res) => res.json(menu));

app.post("/api/menu", (req, res) => {
  const { name, price } = req.body;
  menu.push({ name, price });
  res.send("Added");
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true });
  }
  res.status(403).json({ success: false });
});

// ===== MAIN SITE =====
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>1016 Cafe</title>

<style>
body {
  margin:0;
  font-family: 'Segoe UI', sans-serif;
  background:#0a0a0a;
  color:white;
}

.hero {
  height:100vh;
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

.menu {
  padding:60px 20px;
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(250px,1fr));
  gap:20px;
}

.card {
  backdrop-filter: blur(10px);
  background:rgba(255,255,255,0.05);
  border-radius:15px;
  padding:20px;
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

<div class="menu" id="menu"></div>

<script>
fetch('/api/menu')
.then(res => res.json())
.then(data => {
  const menu = document.getElementById('menu');
  data.forEach(item => {
    menu.innerHTML += \`
      <div class="card">
        <h3>\${item.name}</h3>
        <p>$\${item.price}</p>
      </div>
    \`;
  });
});
</script>

</body>
</html>
`);
});

// ===== ADMIN PANEL =====
app.get("/admin", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<body style="font-family:Arial; padding:40px">

<h2>Admin Login</h2>
<input id="user" placeholder="username"><br><br>
<input id="pass" type="password" placeholder="password"><br><br>
<button onclick="login()">Login</button>

<div id="panel" style="display:none;">
  <h2>Add Menu Item</h2>
  <input id="name" placeholder="Coffee name"><br><br>
  <input id="price" placeholder="Price"><br><br>
  <button onclick="add()">Add</button>
</div>

<script>
function login(){
  fetch('/api/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      username:document.getElementById('user').value,
      password:document.getElementById('pass').value
    })
  })
  .then(res=>res.json())
  .then(d=>{
    if(d.success){
      document.getElementById('panel').style.display='block';
      alert("Logged in");
    } else alert("Wrong login");
  });
}

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

</body>
</html>
`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running"));
