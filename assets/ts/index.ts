const conteiner: Element | null = document.querySelector('.conteiner');

interface Idata {
    products:{
    id: number,
    title:string,
    description:string,
    price:number,
    discountPercentage:number,
    rating:number,
    stock:number,
    brand:string,
    category:string,
    thumbnail:string,
    images:string[],
    }
}
const data = {
    "products": [
    {
    "id": 1,
    "title": "iPhone 9",
    "description": "An apple mobile which is nothing like apple",
    "price": 549,
    "discountPercentage": 12.96,
    "rating": 4.69,
    "stock": 94,
    "brand": "Apple",
    "category": "smartphones",
    "thumbnail": "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
    "images": [
    "https://i.dummyjson.com/data/products/1/1.jpg",
    "https://i.dummyjson.com/data/products/1/2.jpg",
    "https://i.dummyjson.com/data/products/1/3.jpg",
    "https://i.dummyjson.com/data/products/1/4.jpg",
    "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
    ]
    },
    {
    "id": 2,
    "title": "iPhone X",
    "description": "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...",
    "price": 899,
    "discountPercentage": 17.94,
    "rating": 4.44,
    "stock": 34,
    "brand": "Apple",
    "category": "smartphones",
    "thumbnail": "https://i.dummyjson.com/data/products/2/thumbnail.jpg",
    "images": [
    "https://i.dummyjson.com/data/products/2/1.jpg",
    "https://i.dummyjson.com/data/products/2/2.jpg",
    "https://i.dummyjson.com/data/products/2/3.jpg",
    "https://i.dummyjson.com/data/products/2/thumbnail.jpg"
    ]
    },
    {
    "id": 3,
    "title": "Samsung Universe 9",
    "description": "Samsung's new variant which goes beyond Galaxy to the Universe",
    "price": 1249,
    "discountPercentage": 15.46,
    "rating": 4.09,
    "stock": 36,
    "brand": "Samsung",
    "category": "smartphones",
    "thumbnail": "https://i.dummyjson.com/data/products/3/thumbnail.jpg",
    "images": [
    "https://i.dummyjson.com/data/products/3/1.jpg"
    ]
    },
    {
    "id": 4,
    "title": "OPPOF19",
    "description": "OPPO F19 is officially announced on April 2021.",
    "price": 280,
    "discountPercentage": 17.91,
    "rating": 4.3,
    "stock": 123,
    "brand": "OPPO",
    "category": "smartphones",
    "thumbnail": "https://i.dummyjson.com/data/products/4/thumbnail.jpg",
    "images": [
    "https://i.dummyjson.com/data/products/4/1.jpg",
    "https://i.dummyjson.com/data/products/4/2.jpg",
    "https://i.dummyjson.com/data/products/4/3.jpg",
    "https://i.dummyjson.com/data/products/4/4.jpg",
    "https://i.dummyjson.com/data/products/4/thumbnail.jpg"
    ]
    }]
    }
   
function makeBasket (el: Element) :void {
    // conteiner.innerHTML = '';
    const wrapper: HTMLDivElement| null = document.createElement('div');
    if(conteiner){
    conteiner.appendChild(wrapper)
    wrapper.classList.add('wrapper');
    const leftColum = document.createElement('div');
    const rigthColum = document.createElement('div');
    wrapper
            .appendChild(leftColum)
            .appendChild(rigthColum)
        
    
//левая часть где отображают продукты в корзине
        function repitMakeTable(number : number): void{

            const block1 = `  <div class="show-product";
            flex-direction: column-reverse;">
            <div class="show-product_title">
                <span class="text">Products In Cart</span>
                <div class="wrapper-porduct">
                    <div class="number">
                        <span>${number+1}</span>
                    </div>
                    <div class="content">
                        <div class="photo-product"><img src="${data.products[number].images[0]}" alt="prohoto-product"></div>
                        <div class="info-product">
                            <div class="title-product">${data.products[number].title}</div>
                            <div class="description-product">${data.products[number].description}</div>
                            <div class="statistics">
                                <spann class="rating">${data.products[number].rating}</spann>
                                <spann class="discount">${data.products[number].discountPercentage}</spann>
                            </div>
                        </div>
                    </div>
                    <div class="count">
                            <span class="title-stock">Stock</span>
                            <div>
                                <button class="plus">+</button>
                                <span class="for-order">1</span>
                                <button class="minus">-</button>
                            </div>
                            <span class="price">${data.products[number].price}$</span>
                    </div>
                </div>
            </div>
        </div>      `
        const text :HTMLElement | null = document.querySelector('.text')

        if(text){
            text.insertAdjacentHTML('afterend', block1)}
            }

const showProductTitle: HTMLDivElement | null = document.createElement('div');
showProductTitle.classList.add('reverse');
leftColum.appendChild(showProductTitle);
const spanshowProductTitle = document.createElement('span');
spanshowProductTitle.classList.add('text');
showProductTitle.appendChild(spanshowProductTitle);

for(let i = 0; i < data.products.length; i++){
    repitMakeTable(i)
}
//правая часть где отображается сумма и т.д.
const block2 = `<div class="summary">
                    <div class="summary-title">Summary</div>
                    <span class = 'sum-products'>Products:</span>
                    <span class = 'total_cost'>Total:</span>
                    <input class='promocode' type="text" placeholder="Write down PROMOCODE">
                    <button class='bth-buy-now'type="submit">BUY NOW</button>
                </div>`

leftColum.insertAdjacentHTML('afterend', block2)

}}

if(conteiner){
makeBasket(conteiner)}

function totalCost (){
  let totalCost =  document.querySelector('.total_cost');
  let sumProducts = document.querySelector('.sum-products');
  
    let array = [];
    if(totalCost && sumProducts){
    for(let i = 0; i< data.products.length; i++){
        array.push(data.products[i].price)}
        totalCost.innerHTML= `Total: ${array.reduce((a,b)=>{ return a+b})}$`;
        sumProducts.innerHTML = `Products: ${array.length}`
    }
}
totalCost()