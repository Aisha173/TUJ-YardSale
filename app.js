const browseSection = document.querySelector(".browse");
if (browseSection) {
  const items = JSON.parse(localStorage.getItem("items")) || [];

  const grid = document.createElement("div");
  grid.className = "item-grid";
  browseSection.appendChild(grid);


  function renderItems(filterCategory = "All") {
    grid.innerHTML = ""; 
    const filteredItems =
      filterCategory === "All"
        ? items
        : items.filter((item) => item.category === filterCategory);

    if (filteredItems.length === 0) {
      grid.innerHTML = `<p style="color:#A41E35;">No items in this category.</p>`;
      return;
    }

    filteredItems.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "item-card";

      const firstImage =
        item.images && item.images[0]
          ? `<img src="${item.images[0]}" alt="${item.name}" class="item-image">`
          : "";

      div.innerHTML = `
        ${firstImage}
        <h3>${item.name}</h3>
        <p><strong>$${item.price}</strong></p>
        <p class="category-tag">${item.category}</p>
        <p>${item.description}</p>
        <a href="mailto:${item.email}" class="contact-link">Contact</a>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;

      grid.appendChild(div);
    });
  }

  renderItems();

  const categoryList = document.getElementById("categoryList");
  if (categoryList) {
    categoryList.addEventListener("click", (e) => {
      if (e.target.tagName === "LI" || e.target.closest("LI")) {
        const li = e.target.closest("LI");
        const category = li.dataset.category;
        renderItems(category);

        document.querySelectorAll("#categoryList li").forEach((el) => {
          el.classList.remove("active-category");
        });
        li.classList.add("active-category");
      }
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.getAttribute("data-index");
      const confirmDelete = confirm("Do you delete this item?");
      if (confirmDelete) {
        const items = JSON.parse(localStorage.getItem("items")) || [];
        items.splice(index, 1);
        localStorage.setItem("items", JSON.stringify(items));
        location.reload();
      }
    }
  });
}
