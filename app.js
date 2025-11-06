const sellForm = document.getElementById("sellForm");
if (sellForm) {
  sellForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("itemName").value.trim();
    const price = document.getElementById("price").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();

    const pickup = document.getElementById("pickup").value.trim();

    const email = document.getElementById("email").value.trim();
    const files = document.getElementById("image").files;

    if (!name || !price || !category || !description || !pickup || !email) {
      alert("Please fill out all fields before posting.");
      return;
    }

    const images = [];
    const readerPromises = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const promise = new Promise((resolve) => {
        reader.onload = () => {
          images.push(reader.result);
          resolve();
        };
      });
      reader.readAsDataURL(files[i]);
      readerPromises.push(promise);
    }

    Promise.all(readerPromises).then(() => {
      const newItem = {
        name,
        price,
        category,
        description,
        pickup,
        email,
        images,
      };

      const existingItems = JSON.parse(localStorage.getItem("items")) || [];
      existingItems.push(newItem);
      localStorage.setItem("items", JSON.stringify(existingItems));

      alert("Item posted successfully!");
      window.location.href = "index.html";
    });
  });
}

const grid = document.getElementById("itemGrid");
if (grid) {
  let items = JSON.parse(localStorage.getItem("items"));

  if (!items || items.length === 0) {
    items = [
      {
        name: "Used Laptop",
        price: "150000",
        category: "Electronics",
        description: "A reliable laptop great for school and browsing.",
        images: ["demo-images/laptop.jpg"],
        email: "seller1@example.com",
      },
      {
        name: "Office Chair",
        price: "12000",
        category: "Furniture",
        description: "Comfortable office chair.",
        images: ["demo-images/chair.jpg"],
        email: "seller2@example.com",
      },
      {
        name: "Genki Textbook",
        price: "3000",
        category: "Books",
        description: "Used but still in good condition.",
        images: ["demo-images/book.jpg"],
        email: "seller3@example.com",
      },
    ];

    localStorage.setItem("items", JSON.stringify(items));
  }

  function renderItems({ category = "All", query = "" } = {}) {
    grid.innerHTML = "";
    const q = query.trim().toLowerCase();

    const filtered = items.filter((it) => {
      const okCat = category === "All" ? true : it.category === category;
      const okQuery =
        !q ||
        it.name.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q) ||
        it.price.toLowerCase().includes(q);
      return okCat && okQuery;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<p style="color:#A41E35;">No items found.</p>`;
      return;
    }

    filtered.forEach((item) => {
      const card = document.createElement("div");
      card.className = "item-card";

      const firstImage =
        item.images && item.images[0]
          ? item.images[0]
          : "https://placehold.co/400x300/A41E35/FFFFFF?text=No+Image";

      card.innerHTML = `
        <img src="${firstImage}" alt="${item.name}">
        <div class="item-info">
          <h3 class="item-title">${item.name}</h3>
          <p class="item-price">¥${item.price}</p>
          <p class="item-description">${item.description}</p>
          <a href="mailto:${item.email}" class="contact-details-btn">Contact</a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  renderItems();

  const categoryList = document.getElementById("categoryList");
  let currentCategory = "All";
  let currentQuery = "";

  if (categoryList) {
    categoryList.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-category]");
      if (!link) return;
      e.preventDefault();
      currentCategory = link.dataset.category;

      categoryList
        .querySelectorAll("a")
        .forEach((a) => a.classList.remove("active"));
      link.classList.add("active");

      renderItems({ category: currentCategory, query: currentQuery });
    });
  }

  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  function triggerSearch() {
    currentQuery = searchInput?.value ?? "";
    renderItems({ category: currentCategory, query: currentQuery });
  }
  if (searchBtn)
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      triggerSearch();
    });
  if (searchInput)
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        triggerSearch();
      }
    });
}
