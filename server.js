const express = require("express");
const app = express();

app.use(express.json());

// In-memory menu (no DB needed)
let menu = [
  { name: "Latte", price: 4 },
  { name: "Banoffee Latte", price: 5 },
  { name: "Matcha", price: 4 }
];

// API
app.get("/api/menu", (req, res) => {
  res.json(menu);
});

// UI (your website)
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>1016 Cafe</title>
      <style>
        body { margin:0; font-family:Arial; background:#111; color:white; }
        .hero {
          height:100vh;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          background:url('https://images.unsplash.com/photo-1509042239860-f550ce710b93') center/cover;
        }
        h1 { font-size:4rem; }
        .menu { padding:40px; display:grid; grid-template-columns:1fr 1fr; gap:20px;}
        .card { background:#222; padding:20px; border-radius:10px; }
      </style>
    </head>
    <body>

      <div class="hero">
        <h1>1016 Cafe ☕</h1>
        <p>Premium Coffee Experience</p>
      </div>

      <div class="menu" id="menu"></div>

      <script>
        fetch('/api/menu')
          .then(res => res.json())
          .then(data => {
            const menu = document.getElementById('menu');
            data.forEach(item => {
              menu.innerHTML += '<div class="card">' + item.name + ' - $' + item.price + '</div>';
            });
          });
      </script>

    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on port " + PORT));
