const express = require("express");
const app = express();

app.use(express.json());

let menu = [
  { name: "Latte", price: 4 },
  { name: "Banoffee Latte", price: 5 },
  { name: "Matcha", price: 4 }
];

app.get("/api/menu", (req, res) => {
  res.json(menu);
});

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
  height:100vh;
  display:flex;
  flex-direction:column;
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
  animation:fadeUp 1.5s ease;
}

h1 {
  font-size:4rem;
  letter-spacing:2px;
}

p {
  opacity:0.8;
}

.menu {
  padding:60px 20px;
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(250px,1fr));
  gap:20px;
}

.card {
  backdrop-filter: blur(15px);
  background:rgba(255,255,255,0.05);
  border-radius:15px;
  padding:20px;
  transition:0.3s;
}

.card:hover {
  transform:translateY(-5px) scale(1.02);
  background:rgba(255,255,255,0.1);
}

@keyframes fadeUp {
  from { opacity:0; transform:translateY(40px); }
  to { opacity:1; transform:translateY(0); }
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running"));
