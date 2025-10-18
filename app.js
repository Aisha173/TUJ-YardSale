// ====== SELL PAGE ======
const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("itemName").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const email = document.getElementById("email").value;
    const files = document.getElementById("image").files;

    const readerPromises = [];
    const images = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const promise = new Promise((resolve) => {
        reader.onload = () => {
          images.push(reader.result);
          resolve();
        };
      });
      reader.readAsDataURL(file);
      readerPromises.push(promise);
    }

    Promise.all(readerPromises).then(() => {
      const newItem = { name, price, description, email, images };

      const existingItems = JSON.parse(localStorage.getItem("items")) || [];
      existingItems.push(newItem);
      localStorage.setItem("items", JSON.stringify(existingItems));

      alert("Item posted successfully!");
      window.location.href = "index.html";
    });
  });
}

// ====== INDEX PAGE ======
const itemList = document.querySelector(".hero");
if (itemList) {
  const items = JSON.parse(localStorage.getItem("items")) || [];

  if (items.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "No items yet — be the first to post!";
    emptyMsg.style.color = "#A41E35";
    itemList.appendChild(emptyMsg);
  } else {
    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "item-card";

      const imgTag =
        item.images && item.images[0]
          ? `<img src="${item.images[0]}" alt="${item.name}" class="item-image">`
          : "";

      div.innerHTML = `
        ${imgTag}
        <h3>${item.name}</h3>
        <p><strong>Price:</strong> $${item.price}</p>
        <p>${item.description}</p>
        <a href="mailto:${item.email}" class="contact-link">Contact Seller</a>
      `;

      itemList.appendChild(div);
    });
  }
}
