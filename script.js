const API_URL = 'https://tienda-moda.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartList = document.getElementById('cart-items');
  const totalPriceEl = document.getElementById('total-price');
  const cartCount = document.getElementById('cart-count');
  const checkoutBtn = document.getElementById('checkout');
  const feedbackForm = document.getElementById('feedback-form');
  const startButton = document.getElementById('start-button');
  const welcomeScreen = document.getElementById('welcome-screen');
  const themeToggle = document.getElementById('theme-toggle');

  // 🌙 Modo oscuro
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  }
  function animateThemeChange() {
    document.body.classList.add('theme-transition');
    setTimeout(() => document.body.classList.remove('theme-transition'), 600);
  }
  themeToggle.addEventListener('click', () => {
    animateThemeChange();
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Productos
  const products = {
    hombres: [
      { name: "Camisa Casual", price: 50, img: "https://images-na.ssl-images-amazon.com/images/I/71KXnw6ce4L._AC_UL1500_.jpg" },
      { name: "Pantalón Comfy", price: 70, img: "https://www.moov.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dwab2c449f/products/FIF11HT00799-7713/FIF11HT00799-7713-1.JPG" },
      { name: "Chamarra Hombre", price: 200, img: "https://th.bing.com/th/id/R.6a99500d71d5ba33b01d07c51a3fdaed?rik=LVXHHzTCvcUFLA&pid=ImgRaw&r=0" }
    ],
    mujeres: [
      { name: "Vestido Largo", price: 120, img: "https://th.bing.com/th/id/R.34286da4a2a6594ff88b76faadabf659?rik=xA8Htjeuk0%2fhRg&pid=ImgRaw&r=0" },
      { name: "Blusa Estampada", price: 40, img: "https://http2.mlstatic.com/D_NQ_NP_982530-MLC43487861023_092020-O.webp" },
      { name: "Chamarra Mujer", price: 300, img: "https://th.bing.com/th/id/R.ceb83db97d58838aafdca06d96f0045c?rik=aNfl8H0yTmnKmQ&pid=ImgRaw&r=0" }
    ],
    niños: [
      { name: "Camiseta Niño", price: 25, img: "https://th.bing.com/th/id/OIP.7sVu2Y6kJTAzsSXLzLmEBQHaHa?rs=1&pid=ImgDetMain" },
      { name: "Chamarra Invierno", price: 400, img: "https://th.bing.com/th/id/OIP.odm6iVy7RxmW9SfkvTshYQHaLx?rs=1&pid=ImgDetMain" },
      { name: "Lentes Niño", price: 150, img: "https://th.bing.com/th/id/OIP.jNhihXyUaAScAUlJrXr2bAHaHa?rs=1&pid=ImgDetMain" }
    ]
  };

  // Render productos
  for (const [categoria, lista] of Object.entries(products)) {
    const contenedor = document.getElementById(`${categoria}-products`);
    lista.forEach(p => {
      const article = document.createElement('article');
      article.classList.add('product');
      article.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">$${p.price} MXN</p>
        <button class="btn add-to-cart">Añadir al Carrito</button>
      `;
      article.querySelector('.add-to-cart').addEventListener('click', () => addToCart(p));
      contenedor.appendChild(article);
    });
  }

  // Carrito
  function addToCart(product) {
    const existing = cartItems.find(i => i.name === product.name);
    if (existing) existing.quantity++;
    else cartItems.push({ ...product, quantity: 1 });
    saveAndRender();
  }
  function removeFromCart(index) {
    cartItems.splice(index, 1);
    saveAndRender();
  }
  function saveAndRender() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCart();
  }
  function updateCart() {
    cartList.innerHTML = '';
    let total = 0;
    cartItems.forEach((item, index) => {
      total += item.price * item.quantity;
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-item-image">
        ${item.name} - $${item.price} x${item.quantity}
        <button class="remove-item">X</button>
      `;
      li.querySelector('.remove-item').addEventListener('click', () => removeFromCart(index));
      cartList.appendChild(li);
    });
    totalPriceEl.textContent = total;
    cartCount.textContent = cartItems.length;
  }

  checkoutBtn.addEventListener('click', () => {
    if (!cartItems.length) return alert("Tu carrito está vacío.");
    alert("¡Gracias por tu compra!");
    cartItems.length = 0;
    saveAndRender();
  });

  // Feedback
  feedbackForm.addEventListener('submit', e => {
    e.preventDefault();
    alert("¡Gracias por tus sugerencias!");
    feedbackForm.reset();
  });

  // Formulario contacto
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };
    try {
      const res = await fetch(`${API_URL}/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      alert(result.mensaje);
      contactForm.reset();
    } catch (error) {
      alert("❌ Error al enviar el mensaje. Verifica la conexión con el servidor.");
    }
  });

  // Pantalla bienvenida
  startButton.addEventListener('click', () => {
    welcomeScreen.style.opacity = '0';
    setTimeout(() => (welcomeScreen.style.display = 'none'), 500);
  });

  updateCart();
});













