fetch('/api/menu')
.then(res => res.json())
.then(data => {
  const menu = document.getElementById('menu');
  data.forEach(item => {
    menu.innerHTML += `<div class="card">${item.name} - $${item.price}</div>`;
  });
});
