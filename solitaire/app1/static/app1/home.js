const menu = {
  Pizza: [
    { name: "Margherita Pizza", img: "/static/app1/margherita.jpg", price: 450 },
    { name: "Pepperoni Pizza", img: "/static/app1/pepperoni.jpg", price: 500 },
    { name: "BBQ Pizza", img: "/static/app1/bbq.jpg", price: 550 },
    { name: "Veggie Supreme Pizza", img: "/static/app1/veggie_supreme.jpg", price: 480 },
    { name: "Paneer Pizza", img: "/static/app1/paneer.jpg", price: 470 },
    { name: "Mushroom Pizza", img: "/static/app1/mushroom.jpg", price: 460 },
  ],
  Burger: [
    { name: "Cheese Burger", img: "/static/app1/cheese_burger.jpg", price: 80 },
    { name: "Royal Feast Burger", img: "/static/app1/veggie.jpg", price: 110 },
    { name: "Chicken Burger", img: "/static/app1/chicken_burger.jpg", price: 120 },
    { name: "Veggie Burger", img: "/static/app1/veggie_burger.jpg", price: 70 },
    { name: "Double Patty Burger", img: "/static/app1/double_patty.jpg", price: 100 },
    { name: "Non-Veggie Burger", img: "/static/app1/non-veggie.jpg", price: 90 },
  ],
  Sandwich: [
    { name: "Paneer Sub", img: "/static/app1/veg_sub.jpg", price: 150 },
    { name: "Club Sandwich", img: "/static/app1/club_sandwich.jpg", price: 150 },
    { name: "Cheese Sandwich", img: "/static/app1/cheese_sandwich.jpg", price: 120 },
    { name: "Paneer Sandwich", img: "/static/app1/paneer_sandwich.jpg", price: 130 },
    { name: "Chicken Sandwich", img: "/static/app1/chicken_sandwich.jpg", price: 160 },
    { name: "Chicken Sub", img: "/static/app1/chicken_sub.jpg", price: 170 },
  ],
  SouthIndian: [
    { name: "Dosa", img: "/static/app1/dosa.jpg", price: 80 },
    { name: "Idli", img: "/static/app1/idli.jpg", price: 70 },
    { name: "Vada", img: "/static/app1/vada.jpg", price: 60 },
    { name: "Biryani", img: "/static/app1/biryani.jpg", price: 200 },
  ],
  Beverages: [
    { name: "Rose Negroni", img: "/static/app1/rose_negroni.jpg", price: 150 },
    { name: "Purple Hooter", img: "/static/app1/prp_hooter.jpg", price: 160 },
    { name: "Sake Mocktail", img: "/static/app1/sake.jpg", price: 170 },
    { name: "Lemon Ginger", img: "/static/app1/lemon_ginger.jpg", price: 120 },
    { name: "Blue Lagoon", img: "/static/app1/blue_l.jpg", price: 130 },
    { name: "Antruby", img: "/static/app1/antruby.jpg", price: 140 },
  ],
  Desserts: [
    { name: "Chocolava Cake", img: "/static/app1/chocolava.jpg", price: 110 },
    { name: "Oreo Cupcake", img: "/static/app1/oreo_cup.jpg", price: 90 },
    { name: "Brownie Sundae", img: "/static/app1/brownie_sundae.jpg", price: 120 },
    { name: "Gulab Jamun", img: "/static/app1/jamun.jpg", price: 80 },
    { name: "Cheesecake", img: "/static/app1/cheesecake.jpg", price: 130 },
    { name: "Ice Cream", img: "/static/app1/ice_cream.jpg", price: 60 },
  ],
};

const cart = {};

function updateCartCount() {
  const totalCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartCountElem = document.getElementById("cart-count");
  if (cartCountElem) {
    cartCountElem.textContent = totalCount;
  }
}

const tabPanel = document.getElementById("tabPanel");
const tabContent = document.getElementById("tabContent");
const activeBar = document.getElementById("activeBar");
const tabs = Array.from(tabPanel.querySelectorAll(".tab"));

// Mapping tab category names to menu keys
const categoryMap = {
  "Pizza": "Pizza",
  "Burger": "Burger",
  "Sandwich": "Sandwich",
  "South Indian": "SouthIndian",
  "Beverages": "Beverages",
  "Desserts": "Desserts",
};

function renderContent(category) {
  const menuKey = categoryMap[category] || category;
  const items = menu[menuKey] || [];
  tabContent.innerHTML = `
    <ul class="food-list">
      ${items
        .map(
          (item) => `
      <li class="food-item" tabindex="0" style="background-image: url('${item.img}')">
        <div class="food-details-overlay">
          <span class="food-name">${item.name}</span>
          <span class="food-price">₹${item.price}</span>
          <button class="add-cart-btn" data-item="${item.name}" aria-label="Add to Cart">+</button>
        </div>
      </li>
      `
        )
        .join("")}
    </ul>
  `;

  // Add event listeners to plus buttons
  tabContent.querySelectorAll(".add-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const itemName = button.getAttribute("data-item");
      cart[itemName] = (cart[itemName] || 0) + 1;
      updateCart();
    });
  });
}

function moveActiveBar(tab) {
  const tabRect = tab.getBoundingClientRect();
  const left = tab.offsetLeft;
  activeBar.style.width = `${tabRect.width}px`;
  activeBar.style.left = `${left}px`;
}

function setActiveTab(newActive) {
  tabs.forEach((tab) => tab.classList.remove("active"));
  newActive.classList.add("active");
  moveActiveBar(newActive);
  renderContent(newActive.dataset.category);
}

function getItemPrice(name) {
  for (const category in menu) {
    const found = menu[category].find((item) => item.name === name);
    if (found) return found.price;
  }
  return 0;
}

function renderCartDropdown() {
  const dropdown = document.getElementById("cart-dropdown");
  const items = Object.entries(cart).filter(([_, qty]) => qty > 0);

  if (!items.length) {
    dropdown.innerHTML = "Cart is empty.";
    return;
  }

  let total = 0;
  dropdown.innerHTML =
    items
      .map(([name, qty]) => {
        const price = getItemPrice(name);
        const itemTotal = price * qty;
        total += itemTotal;
        return `
          <div class="cart-dropdown-item" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5em;">
            <span style="flex:1;">${name}</span>
            <div style="display:flex; align-items:center; gap:0.5em;">
              <button class="cart-qty-btn cart-minus" data-item="${name}" aria-label="Minus">−</button>
              <span class="cart-qty-value">${qty}</span>
              <button class="cart-qty-btn cart-plus" data-item="${name}" aria-label="Plus">+</button>
            </div>
            <span class="cart-item-price" style="margin-left:1em;">₹${price} × ${qty} = <b>₹${itemTotal}</b></span>
          </div>
        `;
      })
      .join("") +
    `<hr>
      <div class="cart-total" style="text-align:right; font-size:1.1em; margin-top:0.5em;">
        <b>Total: ₹${total}</b>
      </div>

      <button class="checkout-btn">
        Checkout
      </button>`;

  
  dropdown.querySelectorAll(".cart-plus").forEach((btn) => {
    btn.onclick = () => {
      cart[btn.dataset.item] = (cart[btn.dataset.item] || 0) + 1;
      updateCart();
    };
  });
  dropdown.querySelectorAll(".cart-minus").forEach((btn) => {
    btn.onclick = () => {
      cart[btn.dataset.item] = Math.max((cart[btn.dataset.item] || 1) - 1, 0);
      if (cart[btn.dataset.item] === 0) delete cart[btn.dataset.item];
      updateCart();
    };
  });

  const checkoutBtn = dropdown.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      // Optional: Save cart to localStorage so you can access it on checkout page
      localStorage.setItem("cart", JSON.stringify(cart));

      dropdown.classList.remove("visible"); // hide dropdown on checkout click
      window.location.href = "/details"; 
    };
  }
}

function updateCart() {
  updateCartCount();
  renderCartDropdown();
}

document.getElementById("cart-icon").onclick = (e) => {
  e.stopPropagation();
  const dropdown = document.getElementById("cart-dropdown");
  dropdown.classList.toggle("visible");
  renderCartDropdown();
};

document.addEventListener("click", (e) => {
  const cartContainer = document.getElementById("cart-container");
  const dropdown = document.getElementById("cart-dropdown");
  if (!cartContainer.contains(e.target)) {
    dropdown.classList.remove("visible");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  setActiveTab(tabs[0]);
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setActiveTab(tab));
  });
  updateCart();
  document.getElementById("cart-dropdown").addEventListener("click", function (e) {
    e.stopPropagation();
  });
});

window.addEventListener("resize", () => {
  const current = tabPanel.querySelector(".tab.active");
  if (current) moveActiveBar(current);
});
