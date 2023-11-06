function createProductCard(product) {
    const card = document.createElement("div");
    card.classList.add("col-sm-4");
    card.innerHTML = `
      <div class="panel panel-primary">
        <div class="panel-heading">${product.name}</div>
        <div class="panel-body"><img src="${product.image}" class="img-responsive" style="width:100%" alt="Image"></div>
        <div class="panel-footer">$${product.price.toFixed(2)}</div>
      </div>
    `;
    return card;
  }

  
    products.forEach((product) => {
      const productCard = createProductCard(product);
      productContainer.appendChild(productCard);
    });
  