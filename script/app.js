const bars = document.querySelector('.bars');
const productsList = document.querySelector('.products_list');

bars.addEventListener('click', () => {
    const menuList = document.querySelector('.menu_list');
    bars.classList.toggle('active')
    menuList.classList.toggle('active')
})

const openToBag = () => {
    const bagModal = document.querySelector('.bag_modal');
    bagModal.classList.toggle("active")
}


let productList = [], bagList = [];

async function getProduct() {
    let result = await fetch("./script/products.json");
    let data = result.json();
    data.then(product => productList = product)
        .then(() => {
            createProductCartsHtml();
            // filterProduct();
        })
        .then(() => {
            createFilterHtml();
        })
        .catch(err => console.log(err))
}

window.addEventListener('DOMContentLoaded', getProduct())

const createProductCartsHtml = () => {
    let productCartHtml = '';

    productList.forEach(product => {
        productCartHtml += ` 
        <div class="product_cart">
            <img src="${product.image}" alt="">
            <div class="product_info">
                <h3>${product.brand}</h3>
                <p>${product.title}</p>
                <div class="rating">
                    ${starRateHtml(product.rating)}
                </div>
                <span>$${product.price}</span>
            </div>
            <button  onclick="addToBag(${product.id})">ADD TO CART</button>
        </div>`
    })
    productsList.innerHTML = productCartHtml
}

const starRateHtml = (rating) => {
    let starRateHtml = '';
    for (let i = 0; i < 5; i++) {
        if (Math.round(rating) > i) {
            starRateHtml += `<i class="fa-solid fa-star checked"></i>`;
        } else {
            starRateHtml += `<i class="fa-solid fa-star"></i>`;

        }
    }
    return starRateHtml;
}

const addToBag = (productId) => {
    let findedProduct = productList.find(product => product.id == productId);
    if (findedProduct) {
        let findedBagIndex = bagList.findIndex(item => item.product.id == productId)
        if (findedBagIndex == -1) {
            let addItem = { quantity: 1, product: findedProduct };
            bagList.push(addItem)
        } else {
            bagList[findedBagIndex].quantity += 1;
        }
    }
    // console.log(bagList)
    listedBagItems()
}


const listedBagItems = () => {
    localStorage.setItem('bagList', JSON.stringify(bagList));
    let bagListEl = document.querySelector('.bag_list');
    let subTotal = document.querySelector('.subTotal');
    let bagQuantity = document.getElementsByClassName('bag_quantity');
    let bagListHtml = '';
    let totalPrice = 0;
    bagList.forEach(item => {
        totalPrice += item.product.price * item.quantity;
        bagListHtml += ` 
        <li>
            <img src="${item.product.image}" alt="">
            <div class="bag_list_info">
                <h3>${item.product.brand}</h3>
                <p>${item.product.title}</p>
                <span>$${item.product.price}</span>
            </div>
            <div class="quantity">
                <button onclick="decreaseItemToBag(${item.product.id})"><i class="fa-solid fa-minus"></i></button>
                <span>${item.quantity}</span>
                <button onclick="increaseItemToBag(${item.product.id})"><i class="fa-solid fa-plus"></i></button>
            </div>
            <button class="removeBtn" onclick="removeItemToBag(${item.product.id})"><i class="fa-solid fa-trash-can"></i></button>
        </li>`
    })

    bagQuantity[0].innerHTML = bagList.length > 0 ? bagList.length : null;
    bagQuantity[1].innerHTML = bagList.length > 0 ? bagList.length : null;
    subTotal.innerHTML = `<h3 class="subTotal">Subtotal: $${totalPrice.toFixed(2)}</h3>`
    bagListEl.innerHTML = bagListHtml

}

const decreaseItemToBag = (productId) => {
    let findedIndex = bagList.findIndex(item => item.product.id == productId);
    console.log(findedIndex)
    if (bagList[findedIndex].quantity > 1) {
        bagList[findedIndex].quantity -= 1

    } else {
        removeItemToBag(productId)

    }

    listedBagItems()
}

const increaseItemToBag = (productId) => {
    let findedIndex = bagList.findIndex(item => item.product.id == productId);
    console.log(findedIndex)
    bagList[findedIndex].quantity += 1;
    listedBagItems()
}

const removeItemToBag = (productId) => {
    let findedIndex = bagList.findIndex(item => item.product.id == productId);
    bagList.splice(findedIndex, 1);
    listedBagItems()
}


if (localStorage.getItem('bagList')) {
    bagList = JSON.parse(localStorage.getItem('bagList'));
    listedBagItems()
}

// const PRODUCT_TYPES = {
//     ALL: "ALL",
//     CHANEL: "CHANEL",
//     Dior: "Dior",
//     TOMFORD: "TOM FORD",
//     DOLCEGABBANA: "DOLCE & GABBANA",
//     Versace: "Versace",
//     PacoRabanne: "Paco Rabanne",
// };




const createFilterHtml = () => {
    const filterEl = document.querySelector('.filters');
    let filterHtml = '';
    let filterTypes = ['ALL'];
    productList.forEach(product => {
        if (filterTypes.findIndex(filter => filter == product.brand) == -1)
            filterTypes.push(product.brand);
    })

    filterTypes.forEach((type, index) => {
        filterHtml += `<button class=${index == 0 ? "active" : null} onclick="filterProduct(this)">${type}</button>`


    })

    filterEl.innerHTML = filterHtml
    // console.log(filterTypes)
}



const filterProduct = (filter) => {
    document.querySelector('.filters .active').classList.remove('active')
    filter.classList.add('active')



    let productType = filter.innerText;
    if (productType != "ALL") {
        x = productList.filter(product => product.brand == productType);
        let productCartHtml = '';

        x.forEach(product => {
            productCartHtml += ` 
            <div class="product_cart">
                <img src="${product.image}" alt="">
                <div class="product_info">
                    <h3>${product.brand}</h3>
                    <p>${product.title}</p>
                    <div class="rating">
                        ${starRateHtml(product.rating)}
                    </div>
                    <span>$${product.price}</span>
                </div>
                <button  onclick="addToBag(${product.id})">ADD TO CART</button>
            </div>`
        })
        productsList.innerHTML = productCartHtml


    } else {
        getProduct();
    }


}