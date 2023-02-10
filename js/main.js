import { datas } from "./datas.js";

// console.log(datas);
// Sidebar

const menuOpenBtn = document.querySelector(".mobile-menu");
const navbar = document.querySelector(".header_nav");
const closeBtn = document.querySelector(".close-menu");

if (menuOpenBtn) {
    menuOpenBtn.addEventListener("click", () => {
        navbar.classList.add("active");
    });
}

if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        navbar.classList.remove("active");
    });
}

// render shop shop.html

const shopProducts = document.querySelector("#shop");

// console.log(shopProducts);

const renderShop = (datas, element) => {
    const htmls = datas.map((item, index) => {
        return `
                    <div class="products_item"  >
                        <img
                            src=${item.img}
                            alt=""
                            class="product_item-img"
                        />
                        <div class="product_item-des">
                            <span class="product_item-local"> ${item.local}</span>
                            <h4 class="product_item-name">
                                ${item.name}
                            </h4>
                            <div class="product_item-rate">
                                <i class="fa-solid fa-star"></i
                                ><i class="fa-solid fa-star"></i
                                ><i class="fa-solid fa-star"></i
                                ><i class="fa-solid fa-star"></i
                                ><i class="fa-solid fa-star"></i>
                            </div>
                            <div class="product_item-buy">
                                <h4 class="product_item-price">$${item.price}</h4>
                                <span class="add_cart" data-id=${item.id}>
                                    <i class="fa-solid fa-cart-plus"></i>   
                                </span>
                            </div>
                        </div>
                    </div>
        `;
    });

    // console.log(htmls);

    if (element !== null) {
        element.querySelector(".products").innerHTML = htmls.join("");
    }
};

renderShop(datas, shopProducts);

const featureProducts = document.querySelector("#product1");

renderShop(datas.slice(4, 12), featureProducts);

// Thêm sản phẩm vào giỏ hàng
let basket = JSON.parse(localStorage.getItem("data")) || [];

const handleAddCart = (id) => {
    // console.log(id);
    console.log(basket);
    let itemClick = basket.find((item) => item.id === id);
    let itemData = datas.filter((item) => item.id === id);
    // console.log(...itemData);
    if (itemClick === undefined) {
        basket.push(...itemData);
    } else {
        ++itemClick.count;
    }
    // renderShop(datas, shopProducts);
    console.log(basket);
    localStorage.setItem("data", JSON.stringify(basket));
    updateCount();

    // console.log(id);
};

const addCartBtns = document.querySelectorAll(".add_cart");

// console.log(addCartBtns);

addCartBtns.forEach((addCart, index) => {
    // console.log(addCart);
    addCart.addEventListener("click", (e) => {
        handleAddCart(Number(addCart.dataset.id));
    });
});

//update Count cart
const updateCount = () => {
    const cartCountElm = document.querySelector(".cart .count-item");
    cartCountElm.textContent = basket.length;
};
updateCount();
// console.log(basket);

//  Render Cart.html

const cartContainerElm = document.querySelector(".cart-container");

// console.log(cartContainerElm);

function renderCart() {
    if (basket.length === 0) {
        document.querySelector(".cart-empty").classList.remove("hidden");
    } else {
        document.querySelector(".cart-empty").classList.add("hidden");
        cartContainerElm.classList.remove("hidden");
        cartContainerElm.classList.add("active");

        const htmls = basket.map((item, index) => {
            // console.log(typeof item.count);
            let itemClick = datas.find((x) => x.id === item.id);
            // console.log(itemClick);
            return `
            <div class="cart-item " id=${item.id}>
                <div class="item-inf">
                    <img src=${item.img} alt="" class="item-img" />
                    <div>
                        <h2 class="item-name">${item.name}</h2>
                        <p class="item-price">$${item.price}</p>
                    </div>
                </div>
                <div class="size">
                    <span>Size</span>
                    <select name="" id="" class="">
                        <option value="">S</option>
                        <option value="">M</option>
                        <option value="">L</option>
                        <option value="">XL</option>
                        <option value="">2XL</option>
                    </select>
                </div>

                <div class="item-count">
                    <span class="decrease" data-id=${item.id}>
                        <i class="fa-solid fa-minus"></i>
                    </span>
                    <span class="count">${item.count}</span>
                    <span class="increase" data-id=${item.id}>
                        <i class="fa-solid fa-plus"></i>
                    </span>
                </div>
                <div class="total">
                    <span>Total: </span>
                    <span class="total-money">$${
                        itemClick.price * item.count
                    }</span>
                </div>
                <button class="delete" data-id=${item.id}>Delete</button>
        </div>

        `;
        });
        cartContainerElm.innerHTML = htmls.join("");
    }
}

renderCart();

// Increment the count
const increaseBtns = document.querySelectorAll(".increase");
const decreaseBtns = document.querySelectorAll(".decrease");

const getParentElm = (element, selector) => {
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) {
            return element.parentElement;
        } else {
            element = element.parentElement;
        }
    }
};

const handleIncreaseItem = (id, elm) => {
    let itemClick = basket.find((item) => item.id === id);
    // let itemClick = datas.find((x) => x.id === item.id);
    // console.log(elm);
    let newCount = ++itemClick.count;
    let newPrice = itemClick.price * newCount;
    elm.querySelector(".count").textContent = newCount;
    elm.querySelector(".total-money").textContent = newPrice.toFixed(2);
    // console.log(itemClick.price * newCount);
    console.log(elm.querySelector(".total-money"));
    cacultorMoney();

    localStorage.setItem("data", JSON.stringify(basket));
};

increaseBtns.forEach((btn) => {
    btn.onclick = (e) => {
        const elm = getParentElm(e.target, ".cart-item");
        handleIncreaseItem(Number(btn.dataset.id), elm);
    };
});

// Decrement count
const handleDeceaseItem = (id, elm) => {
    let itemClick = basket.find((item) => item.id === id);
    // console.log(itemClick.count);

    var newCount;
    newCount = --itemClick.count;
    if (itemClick === undefined) {
        return;
    } else if (itemClick.count === 0) {
        cartContainerElm.removeChild(elm);
        updateCount();
    }
    console.log(itemClick.count);

    basket = basket.filter((item) => item.count !== 0);
    if (basket.length === 0) {
        document.querySelector(".cart-empty").classList.remove("hidden");

        cartContainerElm.innerHTML = "";
        cartContainerElm.classList.add("hidden");

        updateCount();
    }

    let newPrice = itemClick.price * newCount;
    elm.querySelector(".count").textContent = newCount;
    elm.querySelector(".total-money").textContent = newPrice.toFixed(2);
    // console.log(itemClick.price * newCount);
    // console.log(elm.querySelector(".total-money"));
    // renderCart();

    // renderCart();
    cacultorMoney();

    localStorage.setItem("data", JSON.stringify(basket));
};

decreaseBtns.forEach((btn) => {
    btn.onclick = (e) => {
        const elm = getParentElm(e.target, ".cart-item");
        handleDeceaseItem(Number(btn.dataset.id), elm);
    };
});

// deleteBtns

const deleteBtns = document.querySelectorAll(".delete");
// console.log(decreaseBtns);

deleteBtns.forEach((deleteBtn) => {
    deleteBtn.onclick = (e) => {
        const elm = getParentElm(e.target, ".cart-item");

        // console.log(e.target.dataset.id);
        handleDeleteItem(Number(e.target.dataset.id), elm);
    };
});

const handleDeleteItem = (id, elm) => {
    console.log(id);
    cartContainerElm.removeChild(elm);
    basket = basket.filter((item) => item.id !== id);
    updateCount();
    cacultorMoney();

    localStorage.setItem("data", JSON.stringify(basket));
};

// Total pay

// console.log(money);

const cacultorMoney = () => {
    const totalMoneyElm = document.querySelector(".total_money");
    let money = basket.reduce((acc, init) => {
        // console.log(acc, init);
        return acc + init.count * init.price;
    }, 0);
    console.log(money);

    totalMoneyElm.textContent = "$" + money.toFixed(2);
};
cacultorMoney();
// console.dir(totalMoneyElm);
