// सामान को दिखाने वाला फंक्शन
function displayDeals() {
    const productContainer = document.getElementById('productContainer');
    const deals = JSON.parse(localStorage.getItem('myStoreDeals')) || [];
    
    productContainer.innerHTML = ""; // पुराना साफ़ करें

    deals.forEach((deal) => {
        productContainer.innerHTML += `
            <div class="card">
                <img src="${deal.image}" alt="${deal.name}">
                <div class="card-info">
                    <div class="card-title">${deal.name}</div>
                    <div class="price">₹${deal.price}</div>
                    <a href="${deal.buyUrl}" class="buy-btn" target="_blank">अभी खरीदें</a>
                </div>
            </div>
        `;
    });
}

// सामान को सेव करने वाला फंक्शन (Admin Panel के लिए)
function addDeal() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const image = document.getElementById('pImgUrl').value;
    const buyUrl = document.getElementById('pBuyUrl').value;

    if(!name || !price || !image || !buyUrl) {
        alert("कृपया पूरी जानकारी भरें!");
        return;
    }

    const newDeal = { name, price, image, buyUrl };
    let deals = JSON.parse(localStorage.getItem('myStoreDeals')) || [];
    deals.push(newDeal);
    
    localStorage.setItem('myStoreDeals', JSON.stringify(deals));
    alert("✅ सामान स्टोर में जुड़ गया!");
    window.location.href = "index.html"; // वापस होम पेज पर भेजें
}

// पेज खुलते ही सामान दिखाएँ
if(document.getElementById('productContainer')) {
    displayDeals();
}
