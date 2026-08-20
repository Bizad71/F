const products = [

    {
        id: 1,
        name: "یخچال فریزر دوقلو",
        category: "kitchen",
        price: 48500000,
        discount: 7,
        image: "🧊",
        rating: 4.8
    },

    {
        id: 2,
        name: "تلویزیون هوشمند 55 اینچ",
        category: "tv",
        price: 23500000,
        discount: 10,
        image: "📺",
        rating: 4.7
    },

    {
        id: 3,
        name: "ماشین لباسشویی 9 کیلویی",
        category: "cleaning",
        price: 19800000,
        discount: 9,
        image: "🧺",
        rating: 4.6
    },

    {
        id: 4,
        name: "کولر گازی 24000",
        category: "cooling",
        price: 32500000,
        discount: 7,
        image: "❄️",
        rating: 4.9
    },

    {
        id: 5,
        name: "مایکروویو حرفه‌ای",
        category: "kitchen",
        price: 8900000,
        discount: 9,
        image: "🍳",
        rating: 4.5
    },

    {
        id: 6,
        name: "جاروبرقی قدرتمند",
        category: "cleaning",
        price: 7500000,
        discount: 8,
        image: "🧹",
        rating: 4.6
    },

    {
        id: 7,
        name: "تلویزیون هوشمند 65 اینچ",
        category: "tv",
        price: 34900000,
        discount: 8,
        image: "📺",
        rating: 4.9
    },

    {
        id: 8,
        name: "سرخ‌کن بدون روغن",
        category: "kitchen",
        price: 6200000,
        discount: 11,
        image: "🍟",
        rating: 4.7
    }

];


let cart = [];


/* -----------------------------
   نمایش محصولات
----------------------------- */

function renderProducts(list = products) {

    const grid =
        document.getElementById("productsGrid");


    if (list.length === 0) {

        grid.innerHTML = `

            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:70px 20px;
                color:#9d8f99;
            ">

                <div style="
                    font-size:55px;
                    margin-bottom:15px;
                ">
                    💔
                </div>

                محصولی با این مشخصات پیدا نشد.

            </div>

        `;

        return;
    }


    grid.innerHTML = list.map(product => `

        <article class="product-card">

            <div class="product-image">

                <span class="discount">
                    ${product.discount}%-
                </span>

                <span>
                    ${product.image}
                </span>

            </div>


            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>


                <div class="product-rating">

                    ⭐ ${product.rating}

                    <span style="
                        color:#6f646d;
                        margin-right:5px;
                    ">
                        رضایت مشتری
                    </span>

                </div>


                <div class="price">

                    <div>

                        <strong>
                            ${formatPrice(product.price)}
                        </strong>

                        <small>
                            تومان
                        </small>

                    </div>


                    <button
                        class="add-cart"
                        onclick="addToCart(${product.id})"
                    >

                        + سبد

                    </button>

                </div>

            </div>

        </article>

    `).join("");

}



/* -----------------------------
   قیمت
----------------------------- */

function formatPrice(price) {

    return new Intl.NumberFormat("fa-IR")
        .format(price);

}



/* -----------------------------
   اضافه کردن به سبد
----------------------------- */

function addToCart(id) {

    const product =
        products.find(item => item.id === id);


    if (!product) return;


    const existing =
        cart.find(item => item.id === id);


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    updateCart();

    openCart();

}



/* -----------------------------
   حذف محصول
----------------------------- */

function removeFromCart(id) {

    cart =
        cart.filter(item => item.id !== id);


    updateCart();

}



/* -----------------------------
   آپدیت سبد
----------------------------- */

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");


    let count = 0;

    let total = 0;


    cart.forEach(item => {

        count += item.quantity;

        total +=
            item.price *
            item.quantity;

    });


    cartCount.textContent =
        new Intl.NumberFormat("fa-IR")
            .format(count);


    cartTotal.textContent =
        formatPrice(total) +
        " تومان";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div>
                    🛒
                </div>

                <h3>
                    سبد خرید خالیه
                </h3>

                <p>
                    هنوز محصولی به سبد خرید اضافه نکردی
                </p>

            </div>

        `;

        return;
    }


    cartItems.innerHTML =
        cart.map(item => `

            <div class="cart-item">

                <div class="cart-item-image">
                    ${item.image}
                </div>


                <div class="cart-item-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <span>
                        ${item.quantity}
                        عدد ×
                        ${formatPrice(item.price)}
                        تومان
                    </span>

                </div>


                <button
                    class="remove-btn"
                    onclick="removeFromCart(${item.id})"
                >
                    ✕
                </button>

            </div>

        `).join("");

}



/* -----------------------------
   باز کردن سبد
----------------------------- */

function openCart() {

    document
        .getElementById("cartOverlay")
        .classList.add("active");

}



/* -----------------------------
   باز / بسته کردن سبد
----------------------------- */

function toggleCart() {

    document
        .getElementById("cartOverlay")
        .classList.toggle("active");

}



/* -----------------------------
   بستن سبد
----------------------------- */

function closeCart(event) {

    if (
        event.target.id ===
        "cartOverlay"
    ) {

        toggleCart();

    }

}



/* -----------------------------
   فیلتر محصولات
----------------------------- */

function filterProducts(category) {

    let result;


    if (category === "all") {

        result = products;

    } else {

        result =
            products.filter(
                product =>
                    product.category === category
            );

    }


    renderProducts(result);


    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });

}



/* -----------------------------
   جستجو
----------------------------- */

function searchProducts() {

    const input =
        document.getElementById(
            "searchInput"
        );


    const value =
        input.value
            .trim()
            .toLowerCase();


    if (!value) {

        renderProducts(products);

        return;

    }


    const result =
        products.filter(product =>
            product.name
                .toLowerCase()
                .includes(value)
        );


    renderProducts(result);


    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });

}



/* -----------------------------
   Enter برای جستجو
----------------------------- */

document
    .getElementById("searchInput")
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                searchProducts();

            }

        }
    );



/* -----------------------------
   پرداخت
----------------------------- */

function checkout() {

    if (cart.length === 0) {

        alert(
            "سبد خرید شما خالی است."
        );

        return;

    }


    alert(
        "سفارش شما آماده ثبت است.\n\n" +
        "برای اتصال به درگاه پرداخت، " +
        "باید بخش بک‌اند سایت اضافه شود."
    );

}



/* -----------------------------
   شروع سایت
----------------------------- */

renderProducts();

updateCart();grid.innerHTML = list.map(product => {

return `
<article class="product-card">

<div class="product-image">

<span class="discount">
$`{product.discount}%-
</span>

`${product.image}

</div>

<div class="product-info">

<h3>
$`{product.name}
</h3>

<div class="product-rating">
⭐ `${product.rating}
</div>

<div class="price">

<div>
<strong>
$`{formatPrice(product.price)}
</strong>

<small> تومان</small>
</div>

<button
class="add-cart"
onclick="addToCart(`${product.id})"
>
افزودن
</button>

</div>

</div>

</article>
`;

}).join("");
}

/* فرمت قیمت */

function formatPrice(price) {

return new Intl.NumberFormat("fa-IR").format(price);

}

/* افزودن به سبد */

function addToCart(id) {

const product = products.find(item => item.id === id);

if (!product) return;

const existing = cart.find(item => item.id === id);

if (existing) {

existing.quantity++;

} else {

cart.push({
...product,
quantity: 1
});

}

updateCart();

openCart();

}

/* حذف از سبد */

function removeFromCart(id) {

cart = cart.filter(item => item.id !== id);

updateCart();

}

/* نمایش سبد */

function updateCart() {

const cartItems = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");

const cartTotal = document.getElementById("cartTotal");

let count = 0;
let total = 0;

cart.forEach(item => {

count += item.quantity;

total += item.price * item.quantity;

});

cartCount.textContent = count;

cartTotal.textContent =
formatPrice(total) + " تومان";

if (cart.length === 0) {

cartItems.innerHTML = &lt;p class="empty-cart"&gt; سبد خرید شما خالی است. &lt;/p&gt;;

return;
}

cartItems.innerHTML = cart.map(item => {

return `

<div class="cart-item">

<div class="cart-item-image">
$`{item.image}
</div>

<div class="cart-item-info">

<h4>
`${item.name}
</h4>

<span>
{formatPrice(item.price)}
تومان
</span>

</div>

<button
class="remove-btn"
onclick="removeFromCart(${item.id})"
>
✕
</button>

</div>

`;

}).join("");

}

/* باز کردن سبد */

function openCart() {

document
.getElementById("cartOverlay")
.classList.add("active");

}

/* بستن / باز کردن سبد */

function toggleCart() {

document
.getElementById("cartOverlay")
.classList.toggle("active");

}

/* بستن با کلیک بیرون */

function closeCart(event) {

if (event.target.id === "cartOverlay") {

toggleCart();

}

}

/* فیلتر محصولات */

function filterProducts(category) {

if (category === "all") {

renderProducts(products);

return;
}

const filtered = products.filter(
product => product.category === category
);

renderProducts(filtered);

document
.getElementById("products")
.scrollIntoView({
behavior: "smooth"
});

}

/* جستجو */

function searchProducts() {

const value =
document
.getElementById("searchInput")
.value
.trim()
.toLowerCase();

if (!value) {

renderProducts(products);

return;
}

const result = products.filter(product =>
product.name.toLowerCase().includes(value)
);

renderProducts(result);

document
.getElementById("products")
.scrollIntoView({
behavior: "smooth"
});

}

/* جستجو هنگام Enter */

document
.getElementById("searchInput")
.addEventListener("keydown", function(event) {

if (event.key === "Enter") {

searchProducts();

}

});

/* پرداخت */

function checkout() {

if (cart.length === 0) {

alert("سبد خرید شما خالی است.");

return;
}

alert(
"سفارش شما آماده ثبت است.\n" +
"در نسخه واقعی، این قسمت به درگاه پرداخت متصل می‌شود."
);

}

/* اجرای اولیه */

renderProducts();

updateCart();
