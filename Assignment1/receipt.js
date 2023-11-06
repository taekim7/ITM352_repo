// Function to calculate the total price of items in the cart
function calculateTotalPrice(cart) {
    let total = 0;
    for (const item of cart) {
      total += item.price;
    }
    return total;
  }
  
  // Function to display the receipt
  function displayReceipt() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const receiptDetails = document.getElementById('receipt-details');
  
    if (cart.length === 0) {
      receiptDetails.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }
  
    receiptDetails.innerHTML = '<h2>Receipt</h2>';
  
    cart.forEach(item => {
      receiptDetails.innerHTML += `<p>${item.name}: $${item.price}</p>`;
    });
  
    const total = calculateTotalPrice(cart);
    receiptDetails.innerHTML += `<p>Total: $${total}`;
  }
  
  // Call the function to display the receipt when the page loads
  displayReceipt();
  