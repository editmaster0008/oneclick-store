// OneClick Store - Final FIXED Script for Ashish
// This file connects your HTML to Firebase Database

const firebaseConfig = {
    apiKey: "AIzaSyDRRT-hzEe_HlG8hBke7mEKzad0O71Dfws",
    authDomain: "oneclick-store-53020.firebaseapp.com",
    databaseURL: "https://oneclick-store-53020-default-rtdb.firebaseio.com",
    projectId: "oneclick-store-53020",
    storageBucket: "oneclick-store-53020.firebasestorage.app",
    messagingSenderId: "103755153136",
    appId: "1:103755153136:web:e98e411fb78B1addffcc35"
};

// Initialize Firebase (Compat Mode)
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// आपका पासवर्ड: आप इसे यहाँ बदल सकते हैं
const ADMIN_PASSWORD = "AshishAdmin786";

// ==================== USER FUNCTIONS (Main Page) ====================
function loadProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    database.ref('products').on('value', (snapshot) => {
        const products = snapshot.val();
        productsContainer.innerHTML = '';
        
        if (!products) {
            productsContainer.innerHTML = '<p style="text-align:center; padding:20px;">अभी कोई डील नहीं है।</p>';
            return;
        }
        
        const productsArray = Object.entries(products).map(([id, product]) => ({
            id, ...product
        })).reverse();
        
        productsArray.forEach(product => {
            const imgUrl = product.imageUrl || product.img;
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${imgUrl}" class="product-image" onerror="this.src='https://via.placeholder.com/150'">
                <h3 class="product-title">${product.name}</h3>
                <a href="${product.link}" target="_blank" class="btn-view-deal">View Deal</a>
            `;
            productsContainer.appendChild(productCard);
        });
    });
}

// ==================== ADMIN FUNCTIONS ====================
function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadAdminProducts();
}

function loadAdminProducts() {
    const list = document.getElementById('productsList');
    if (!list) return;
    
    database.ref('products').on('value', (snapshot) => {
        const products = snapshot.val();
        list.innerHTML = '';
        if (!products) {
            document.getElementById('totalProducts').textContent = '0';
            return;
        }
        
        const pArray = Object.entries(products).map(([id, p]) => ({ id, ...p })).reverse();
        document.getElementById('totalProducts').textContent = pArray.length;
        
        pArray.forEach(p => {
            const img = p.imageUrl || p.img;
            list.innerHTML += `
                <div class="product-item">
                    <img src="${img}" class="product-image-small">
                    <div style="flex-grow:1;">${p.name}</div>
                    <button class="btn-delete" onclick="deleteProduct('${p.id}')">Delete</button>
                </div>`;
        });
    });
}

function deleteProduct(id) {
    if(confirm("डिलीट करें?")) database.ref('products/' + id).remove();
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    const isAdminPage = window.location.pathname.includes('darkblack.html');
    
    if (isAdminPage) {
        if (localStorage.getItem('adminLoggedIn') === 'true') showAdminPanel();
        
        document.getElementById('loginBtn').addEventListener('click', () => {
            const pass = document.getElementById('adminPassword').value;
            if (pass === ADMIN_PASSWORD) {
                localStorage.setItem('adminLoggedIn', 'true');
                showAdminPanel();
            } else { alert("गलत पासवर्ड!"); }
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('adminLoggedIn');
            location.reload();
        });

        document.getElementById('addProductForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const n = document.getElementById('productName').value;
            const l = document.getElementById('productLink').value;
            const i = document.getElementById('productImage').value;
            
            database.ref('products/' + Date.now()).set({
                name: n, link: l, imageUrl: i
            }).then(() => {
                alert("डील पोस्ट हो गयी!");
                document.getElementById('addProductForm').reset();
            });
        });
    } else {
        loadProducts();
    }
});
