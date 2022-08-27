// Toggle burgermenu
const navIcon = document.querySelector('.nav-icon');
const toggleMenu = document.querySelector('.collapse');
navIcon.addEventListener('click', () => {
    navIcon.classList.toggle('open');
    toggleMenu.classList.toggle('active');
})
// Toggle burgermenu


// Accordion Filtter
const accBtn = document.querySelectorAll('.accBtn');
const accPanels = document.querySelectorAll('.accPanel');
const accIcon = document.querySelectorAll('.accIcon');
accPanels[1].style.display = 'block';
accIcon[1].style.rotate = '180deg';

accBtn.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        let accPanel = btn.nextElementSibling;


        if (accPanel.style.display == 'block') {
            accPanel.style.display = 'none';
            accIcon[index].style.rotate = '0deg';
        } else {
            accPanel.style.display = 'block';
            accIcon[index].style.rotate = '180deg';

        }
    })
})
// Accordion Filtter


// Toggle Bag

const openBag = () => {
    const bagModal = document.querySelector('.bagModal');
    bagModal.classList.toggle('active');

}

// Toggle Bag



// Shopping Cart

window.addEventListener('DOMContentLoaded', getProduct)

let productList = [];
let bagList = [];



async function getProduct() {

    let result = await fetch('./js/products.json');
    let data = result.json();
    data.then(res => productList = res)
        .then(() => {
            createProductCart();
            createFilterHtml();
        })

}

const createProductCart = () => {
    const productContent = document.querySelector('.productContent');
    let cartHtml = '';
    productList.forEach(item => {
        cartHtml += `
            <div class="col-11 col-sm-6 col-md-4">
                <div class="card m-2 shadow ">
                    <img src="${item.image}" class="card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${item.brand}</h5>
                        <p class="card-text my-2 text-truncate w-75">${item.title}</p>
                        <p class="card-text fw-bold my-2">$${item.price}</p>
                        <p class="my-2">
                            ${starRateHtml(item.rating)}
                        </p>
                    </div>
                    <button class="btn btn-dark addBtn" onclick="addToBag(${item.id})">ADD</button>
                </div>
            </div>`
    })

    productContent.innerHTML = cartHtml;
}


const starRateHtml = (rating) => {
    let starRateHtml = '';

    for (let i = 0; i < 5; i++) {
        if (Math.round(rating) > i) {
            starRateHtml += '<i class="bi bi-star-fill text-warning"></i>'
        } else {
            starRateHtml += '<i class="bi bi-star-fill"></i>'
        }

    }

    return starRateHtml
}


const addToBag = (productId) => {
    let findedProduct = productList.find(product => product.id == productId);
    if (findedProduct) {
        let findedBagIndex = bagList.findIndex(item => item.product.id == productId);
        if (findedBagIndex == -1) {
            let addItem = { quantity: 1, product: findedProduct };
            bagList.push(addItem);
        } else {
            bagList[findedBagIndex].quantity += 1;
        }

    }

    listedBagItems();
}


const listedBagItems = () => {

    localStorage.setItem('bagList', JSON.stringify(bagList))
    const checkout = document.querySelector('.checkout');
    const bag_list = document.querySelector('.bag-list');
    let bagItemHtml = '';
    let totalPrice = 0;
    let bagCount = 0;
    bagList.forEach(item => {
        bagCount += item.quantity;
        totalPrice += item.quantity * item.product.price
        bagItemHtml += `
        <li class="list-group-item d-flex p-2">
            <div class="product-img w-50">
                <img src="${item.product.image}" class="img-fluid" alt="">
            </div>
            <div class="w-100 ps-2">
                <h5>${item.product.brand}</h5>
                <p class="fs-6 mb-2 text-truncate" style="max-width:200px">${item.product.title}</p>
                <p class="mb-2 fw-bold">$${item.product.price}</p>
                <div class="d-flex align-items-center">
                    <div class="quantity me-2 align-middle">
                        <button onclick="decreaseItem(${item.product.id})"><i class="bi bi-dash"></i></button>
                        <span class="text-secondary px-2 py-1">${item.quantity}</span>
                        <button onclick="increaseItem(${item.product.id})"><i class="bi bi-plus"></i></button>
                    </div>
                    <button class="btn btn-link text-secondary" onclick="removeItem(${item.product.id})">remove</button>
                </div>
            </div>
        </li>`
    })
    document.querySelector('.badge').innerHTML = bagCount == 0 ? "" : bagCount;
    if (totalPrice != 0) {
        checkout.style.display = 'block';
        checkout.querySelector('.totalPrice').innerHTML = `Total: $${totalPrice.toFixed(2)}`
    } else {
        checkout.style.display = 'none';
    }
    bag_list.innerHTML = bagItemHtml;

}


const removeItem = (productId) => {
    let findedIndex = bagList.findIndex(item => item.product.id == productId);
    bagList.splice(findedIndex, 1)
    listedBagItems();
}


const decreaseItem = (productId) => {
    let findedIndex = bagList.findIndex(item => item.product.id == productId);
    bagList[findedIndex].quantity -= 1;
    if (bagList[findedIndex].quantity < 1) {
        removeItem(productId)
    }
    listedBagItems()
}


const increaseItem = (productId) => {
    let findedIndex = bagList.findIndex(item => item.product.id == productId);
    bagList[findedIndex].quantity += 1;
    listedBagItems();

}


if (localStorage.getItem('bagList')) {
    bagList = JSON.parse(localStorage.getItem('bagList'));
    listedBagItems()
}
// Shopping Cart


// Product Filtration

const createFilterHtml = () => {
    const filterEl = document.querySelector('.filterEl');
    let filterTypes = ['All'];
    let filterHtml = '';

    productList.forEach(product => {
        if (filterTypes.findIndex(filter => filter == product.brand) == -1) {
            filterTypes.push(product.brand)
        }
    })

    filterTypes.forEach((type, index) => {
        filterHtml += `<button class="btn border text-start filterBtn ${index == 0 ? "active" : ""} " onclick="filterProduct(this)">${type}</button>`
    })

    filterEl.innerHTML = filterHtml

}


const productContent = document.querySelector('.productContent');


const filterProduct = (filter) => {
    document.querySelector('.filterEl .active').classList.remove('active');
    filter.classList.add('active');
    document.querySelector('#priceFilter0').checked = true;

    let brandName = filter.innerText;
    let filteredList = [];
    if (brandName != 'All') {
        filteredList = productList.filter(product => product.brand == brandName);
        let productCardHtml = '';
        filteredList.forEach(item => {
            productCardHtml += `
            <div class="col-11 col-sm-6 col-md-4">
                <div class="card m-2 shadow ">
                    <img src="${item.image}" class="card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${item.brand}</h5>
                        <p class="card-text my-2 text-truncate w-75">${item.title}</p>
                        <p class="card-text fw-bold my-2">$${item.price}</p>
                        <p class="my-2">
                            ${starRateHtml(item.rating)}
                        </p>
                    </div>
                    <button class="btn btn-dark addBtn" onclick="addToBag(${item.id})">ADD</button>
                </div>
            </div>`
        })
        productContent.innerHTML = productCardHtml;

    } else {
        getProduct()
    }
}

// Product Filtration




function priceFilter(filter) {
    document.querySelector('.filterEl .active').classList.remove('active');
    document.querySelectorAll('.filterBtn')[0].classList.add('active');

    let filterType = filter.value;

    let filteredList = []
    switch (filterType) {
        case 'under$25':
            filteredList = productList.filter(product => product.price <= 25);
            break;
        case '$25to$50':
            filteredList = productList.filter(product => product.price > 25 && product.price <= 50);
            break;
        case '$50to$100':
            filteredList = productList.filter(product => product.price > 50 && product.price <= 100);
            break;
        case '$100andabove':
            filteredList = productList.filter(product => product.price > 100);
            break;
        default:
            filteredList = productList
    }
    let productCardHtml = '';
    filteredList.forEach(item => {
        productCardHtml += `
                <div class="col-11 col-sm-6 col-md-4">
                    <div class="card m-2 shadow ">
                        <img src="${item.image}" class="card-img-top" alt="">
                        <div class="card-body">
                            <h5 class="card-title text-truncate">${item.brand}</h5>
                            <p class="card-text my-2 text-truncate w-75">${item.title}</p>
                            <p class="card-text fw-bold my-2">$${item.price}</p>
                            <p class="my-2">
                                ${starRateHtml(item.rating)}
                            </p>
                        </div>
                        <button class="btn btn-dark addBtn" onclick="addToBag(${item.id})">ADD</button>
                    </div>
                </div>`
    })
    productContent.innerHTML = productCardHtml;
    console.log(filteredList)
}