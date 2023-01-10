
const conteiner = document.querySelector('.conteiner');
let arrayPromo = [];


const data = {
    "products": [
    {
    "id": 1,
    "title": "iPhone 9",
    "description": "An apple mobile which is nothing like apple",
    "price": 549,
    "discountPercentage": 12.96,
    "rating": 4.69,
    "stock": 4,
    "brand": "Apple",
    "category": "smartphones",
    "thumbnail": "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
    "images": [
    "https://i.dummyjson.com/data/products/1/1.jpg",
    "https://i.dummyjson.com/data/products/1/2.jpg",
    "https://i.dummyjson.com/data/products/1/3.jpg",
    "https://i.dummyjson.com/data/products/1/4.jpg",
    "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
    ],
    "count": 2,
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
    ],
    "count": 2,
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
    ],
    "count": 2,
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
    ],
    "count": 2,
    }]
    }

function makeBasket (){
conteiner.innerHTML = '';
const block2 = `<div class="summary">
                <div class="summary-title">Summary</div>
                <span class = 'sum-products'>Products:</span>
                <span class = 'total_cost'>Total:</span>
                <input class='promocode' type="text" placeholder="Write down PROMOCODE" value=''>
                <span>test promo - RS, EPAM</span>
                <button class='bth-buy-now'type="submit">BUY NOW</button>
            </div>`
const wrapper = document.createElement('div');
conteiner.appendChild(wrapper);
wrapper.classList.add('wrapper');
const leftColum = document.createElement('div');
const rigthColum = document.createElement('div');
wrapper.appendChild(leftColum)
wrapper.appendChild(rigthColum)
    
leftColum.classList.add('leftColum');
leftColum.classList.add('reverse')
rigthColum.classList.add('rigthColum');

for(let i = 0; i < data.products.length; i++){
    repitMakeTable(data ,i)
}
rigthColum.insertAdjacentHTML('afterbegin', block2)
}makeBasket()

function repitMakeTable(data ,i){
const block1 = `  <div class="show-product";
flex-direction: column-reverse;">
<div class="show-product_title ">
    <span class="text">Products In Cart</span>
    <div class="wrapper-porduct">
        <div class="number">
            <span>${i+1}</span>
        </div>
        <div class="content">
            <div class="photo-product"><img src="${data.products[i].images[0]}" alt="prohoto-product"></div>
            <div class="info-product">
                <div class="title-product">${data.products[i].title}</div>
                <div class="description-product">${data.products[i].description}</div>
                <div class="statistics">
                    <spann class="rating">${data.products[i].rating}</spann>
                    <spann class="discount">${data.products[i].discountPercentage}</spann>
                </div>
            </div>
        </div>
        <div class="count">
                <span class="title-stock">Stock</span>
                <div>
                    <button class="plus">+</button>
                    <span class="for-order">${data.products[i].count}</span>
                    <button class="minus">-</button>
                </div>
                <span class="price">${data.products[i].price * data.products[i].count}$</span>
        </div>
    </div>
</div>
</div>      `;
const leftColum = document.querySelector('.leftColum')
leftColum.insertAdjacentHTML('afterbegin', block1);

}

function bthOn(){
const bthPlus = document.querySelectorAll('.plus');
const forOrder = document.querySelectorAll('.for-order')
const bthMinus = document.querySelectorAll('.minus');
bthPlus.forEach((el)=>{
    el.addEventListener('click', ()=>{
        let index = [...bthPlus].indexOf(el);
        const arrayStock = data.products.reverse();
        if(arrayStock[index].stock != arrayStock[index].count){
        data.products[index].count = data.products[index].count + 1;
        forOrder[index].textContent = data.products[index].count; 
        }
        finalCost()  
    })
})
bthMinus.forEach((el)=>{
    el.addEventListener('click', ()=>{
        let index = [...bthMinus].indexOf(el);
        data.products[index].count = data.products[index].count - 1;
        forOrder[index].textContent = data.products[index].count;  
        if(data.products[index].count == 0){
            deleteItem(index)
        }
        finalCost()
    })
})}bthOn()

function deleteItem (index) {
    if(data.products[index].count == 0){
        data.products = [...data.products.slice(0, index), ...data.products.slice(index + 1)].reverse()
        const leftColum = document.querySelector('.leftColum');
        leftColum.innerHTML = '';
        for(let i = 0; i < data.products.length; i++){
            repitMakeTable(data ,i)
        }
        bthOn()
        } 
}

function finalCost (){
const sumProducts = document.querySelector('.sum-products');
const totalCosts =  document.querySelector('.total_cost');
const blockWithPromo = `<spam>${arrayPromo} - 10%</spam>`;
const priceItem = document.querySelectorAll('.price');
const arrayCount = [];
const arrayPrice = [];

for(let i = 0; i< priceItem.length; i++){
    arrayCount.push(data.products[i].count);
    arrayPrice.push(data.products[i].price);
}
    sumProducts.innerHTML = `${arrayCount.reduce((a,b)=>{ return a+b})}`
    const total = arrayPrice.map((val, i ) =>{ return val  *  data.products[i].count}).reduce((a,b)=>{ return a+b})
    totalCosts.innerHTML = `Products: ${total}$` ; 
    
    if(arrayPromo.length == 1){
        totalCosts.innerHTML= `Total: ${Math.floor(total / 100 * 90)}$`;
        // totalCosts.insertAdjacentHTML('afterend', blockWithPromo);
    }else if(arrayPromo.length == 2){
        totalCosts.innerHTML= `Total: ${Math.floor(total  / 100 * 80)}$`;
        // totalCosts.insertAdjacentHTML('afterend', blockWithPromo);
    }
}finalCost()
     
function promocodeOn () {
  const promocode = document.querySelector('.promocode');
  promocode.oninput = () =>{
  if(promocode.value == 'RS' || promocode.value == 'EPAM'){
      const blockSubmitPromo = `<div class = 'blockSubmitPromo'>${promocode.value} - 10% <button class='add-promo'>add</button></div>`;
      promocode.insertAdjacentHTML('afterend', blockSubmitPromo)
      promocodeADD()
  }else{
    document.querySelector('.blockSubmitPromo').remove()}
  } 
}promocodeOn()

function promocodeADD(){
  const addPromo = document.querySelector('.add-promo');
  const promocode = document.querySelector('.promocode');
  const blockWithPromo = `<spam class='promo${arrayPromo.length}'>${promocode.value} - 10%<button class='bth-drop${arrayPromo.length}'>drop</button></spam>`;
  const totalCost = document.querySelector('.total_cost');
  const isPromo = arrayPromo.every(el => el !== promocode.value)
  if(isPromo){
      addPromo.addEventListener('click', ()=>{
      arrayPromo.push(promocode.value);
      finalCost()
      totalCost.insertAdjacentHTML('afterend', blockWithPromo);
      document.querySelector('.blockSubmitPromo').remove(document.querySelector('.blockSubmitPromo'))
      promocode.value="";
      promocodeDrop()
      }
  )}else{alert('you used this promo')}
}

function promocodeDrop(){
    const drop0 = document.querySelector('.bth-drop0');
    drop0.addEventListener('click', ()=>{
        document.querySelector('.promo0').remove()
        arrayPromo.shift()
        finalCost()
    })
    
    const drop1 = document.querySelector('.bth-drop1');
    if(drop1){
    drop1.addEventListener('click', ()=>{
        document.querySelector('.promo1').remove();
        arrayPromo.pop()
        finalCost()
    })}
}        

const bthBuyNow = document.querySelector('.bth-buy-now');
console.log(bthBuyNow)
        bthBuyNow.addEventListener('click', ()=>{

            const blockCreditCard = `
            <div>
            <div><span class='type-card'></span><input placeholder="Card number" type="number" class="cardnumber"><span class='error error-card'></span></div>
            <div class='wrapper-valid'><input placeholder='00/00' class='valid' type='text' maxlength='5'><span class='error error-valid'></span></div>
            <div><input placeholder="Code" type="number" class="cvv"><span class='error error-code'></span></div>
            </div>
            `;
            const BlockBuyNow = 
            `<div class='overflow'>
                <div class='main-buy-now'>
                <h2>Personal details</h2>
                <div><input placeholder="Name" type="text" class="name"><span class='error error-name'></span></div>
                <div><input placeholder="PhoneNumber" type="number"  class="phone"><span class='error error-phone'></span></div>
                <div><input placeholder="Adress" type="text" class="adress"><span class='error error-adress'></span></div>
                <div><input placeholder="E-mail" type="email" min='000' max='999' class="mail"><span class='error error-mail'></span></div>
                <h2>Credit card details</h2>
                <div class='credit-catd'>
                ${blockCreditCard}
                </div>
                <button type="submit" class='bth-submit'>Submit</button>
                <div>
            </div>`;
            conteiner.insertAdjacentHTML('afterbegin', BlockBuyNow)
                  

            function nameValid (){
                const name = document.querySelector('.name');
                name.oninput = () =>{
                    const str = (name.value).split(' ');
                    if(str[0].length<3 || str[1].length<3){
                        document.querySelector('.error-name').innerHTML ='ERROR'
                    }else{document.querySelector('.error-name').innerHTML =''}
                }
            }nameValid()

            function phoneValid () {
                const phone = document.querySelector('.phone')
                phone.oninput = () =>{
                    const number = (phone.value).split('').map(el=>+el);
                    if(number.length < 9 || phone.value[0] === undefined){
                        document.querySelector('.error-phone').innerHTML = "ERROR"
                    }else(document.querySelector('.error-phone').innerHTML = "")
                }
            }phoneValid()

            function adressValid(){
                const adres = document.querySelector('.adress'); 
                adres.oninput = () =>{
                   const arrayAdress = adres.value.trim().split(' ');
                    const isTrue = arrayAdress.every(el=> el.length > 2)
                   if(!isTrue || arrayAdress.length < 3){
                    document.querySelector('.error-adress').innerHTML = "ERROR"
                }else(document.querySelector('.error-adress').innerHTML = "")
                   }
            }adressValid()


            function mailValid(){
            const email = document.querySelector('.mail');
             email.oninput = () => {
                const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
                if (EMAIL_REGEXP.test(email.value)) {
                document.querySelector('.error-mail').innerHTML = ""
              } else {
                document.querySelector('.error-mail').innerHTML = "ERROR"
              }
            }};mailValid()

            function cardValid (){
                const card = document.querySelector('.cardnumber');
                const typeCard = document.querySelector('.type-card');
                card.oninput= () =>{

                    switch (card.value[0]) {
                        case '3':
                            typeCard.innerHTML = 'Maestro';
                          break;
                        case '4':
                            typeCard.innerHTML = 'Visa';
                          break;
                        case '5':
                            typeCard.innerHTML = 'MasterCard';
                          break;
                      };
                    
                   if(card.value.length < 12){
                    document.querySelector('.error-card').innerHTML = 'ERROR'
                   }else{document.querySelector('.error-card').innerHTML = ''}
                   
                }
            }cardValid ()

            function expirationDate () {
                const cardData = document.querySelector('.valid');
                cardData.oninput = (e) =>{
                    const month = cardData.value.slice(0,2) <= 31 && cardData.value.slice(0,2) != 0;
                    const year = cardData.value.slice(3) <= 12 && cardData.value.slice(3) != 0;
                    console.log()
                    const value = e.target.value.length > 2 ? e.target.value.slice(0, 2) + e.target.value.slice(3) : e.target.value
                    if (isNaN(value)){
                        e.target.value = e.target.value.slice(0, e.target.value.length - 1)
                    }
                    if(cardData.value.length === 2){
                        cardData.value += '/';
                    }
                    if(!(cardData.value.length > 4 && month && year)){
                        document.querySelector('.error-valid').innerHTML = 'ERROR'
                       }else{document.querySelector('.error-valid').innerHTML = ''}
                }
            }expirationDate ()



            function codeValid(){
                const cvv = document.querySelector('.cvv');
                cvv.oninput = () =>{
                    if(cvv.value.length < 3){
                        document.querySelector('.error-code').innerHTML = 'ERROR'
                    }else{document.querySelector('.error-code').innerHTML = ''}
                }
               return cvv.value 
            }codeValid()
        
            document.querySelector('.bth-submit').addEventListener('click', ()=>{
                const cvv = document.querySelector('.cvv');
                const cardData = document.querySelector('.valid');
                const card = document.querySelector('.cardnumber');
                const email = document.querySelector('.mail');
                const adres = document.querySelector('.adress'); 
                const phone = document.querySelector('.phone');
                const name = document.querySelector('.name');
                
//    document.querySelector('.error-card').innerHTML = 'ERROR'} 
//        document.querySelector('.error-mail').innerHTML = "ERROR"}
//        document.querySelector('.error-adress').innerHTML = 'ERROR'}
//                document.querySelector('.error-valid').innerHTML = 'ERROR'}
//document.querySelector('.error-code').innerHTML = 'ERROR'} 
//        document.querySelector('.error-phone').innerHTML = 'ERROR'}
                let array = [document.querySelector('.cvv'),
                document.querySelector('.valid'),
                ent.querySelector('.cardnumber'),
                 document.querySelector('.mail'),
                cument.querySelector('.adress'),
                document.querySelector('.phone'),
                 document.querySelector('.name'),];
                 const isTrue =array.every(el => el.textContent >0)
                const error = document.querySelectorAll('.error')
                if(error.forEach(el => {console.log(el.textContent != "ERROR")})){alert('ваш зака принят')
                data.products = []}

            })
            
})

  //    let arrayPrice = [...data.products].reverse()
        //    priceItem[index].textContent = +priceItem[index].textContent.slice(0, -1) - arrayPrice[index].price +'$';
        //    totalCost();
        //    let indexSpeshl = [...bthMinus].reverse().indexOf(el);
        //    if(forOrder[index].textContent == 0){
        //     deleteItem(data, indexSpeshl)
        //     }