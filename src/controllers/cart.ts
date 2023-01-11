// import { CartItem, Controller } from "../types";


// export class CartController extends Controller {
//     init() {
//         const container = document.querySelector('.cart__inner');
// let arrayPromo: string[] = [];



// const cartJSON = localStorage.getItem('cart');
// const data = cartJSON ? JSON.parse(cartJSON) : [];
// function makeBasket (){
//     console.log(container);
    
//     if (!container) return;
// container.innerHTML = '';
// const block2 = `<div class="summary">
//                 <div class="summary-title">Summary</div>
//                 <span class = 'sum-products'>Products:</span>
//                 <span class = 'total_cost'>Total:</span>
//                 <input class='promocode' type="text" placeholder="Write down PROMOCODE" value=''>
//                 <span>test promo - RS, EPAM</span>
//                 <button class='bth-buy-now'type="submit">BUY NOW</button>
//             </div>`
// const wrapper = document.createElement('div');
// container.appendChild(wrapper);
// wrapper.classList.add('wrapper');
// const leftColum = document.createElement('div');
// const rigthColum = document.createElement('div');
// wrapper.appendChild(leftColum)
// wrapper.appendChild(rigthColum)
    
// leftColum.classList.add('leftColum');
// leftColum.classList.add('reverse')
// rigthColum.classList.add('rigthColum');

// for(let i = 0; i < data.length; i++){
//     repitMakeTable(data ,i)
// }
// rigthColum.insertAdjacentHTML('afterbegin', block2)
// }makeBasket()

// function repitMakeTable(data: CartItem[] ,i: number) {
// const block1 = `  <div class="show-product";
// flex-direction: column-reverse;">
// <div class="show-product_title ">
//     <span class="text">Products In Cart</span>
//     <div class="wrapper-porduct">
//         <div class="number">
//             <span>${i+1}</span>
//         </div>
//         <div class="content">
//             <div class="photo-product"><img src="${data[i].product.images[0]}" alt="prohoto-product"></div>
//             <div class="info-product">
//                 <div class="title-product">${data[i].product.title}</div>
//                 <div class="description-product">${data[i].product.description}</div>
//                 <div class="statistics">
//                     <spann class="rating">${data[i].product.rating}</spann>
//                     <spann class="discount">${data[i].product.discountPercentage}</spann>
//                 </div>
//             </div>
//         </div>
//         <div class="count">
//                 <span class="title-stock">Stock</span>
//                 <div>
//                     <button class="plus">+</button>
//                     <span class="for-order">${data[i].count}</span>
//                     <button class="minus">-</button>
//                 </div>
//                 <span class="price">${data[i].product.price * data[i].count}$</span>
//         </div>
//     </div>
// </div>
// </div>      `;
// const leftColum = document.querySelector('.leftColum');
// if (leftColum) {
//     leftColum.insertAdjacentHTML('afterbegin', block1);
// }
// }

// function bthOn(){
// const bthPlus = document.querySelectorAll('.plus');
// const forOrder = document.querySelectorAll('.for-order')
// const bthMinus = document.querySelectorAll('.minus');
// bthPlus.forEach((el)=>{
//     el.addEventListener('click', ()=>{
//         let index = [...bthPlus].indexOf(el);
//         const arrayStock = data.products.reverse();
//         if(arrayStock[index].stock != arrayStock[index].count){
//         data.products[index].count = data.products[index].count + 1;
//         forOrder[index].textContent = data.products[index].count; 
//         }
//         finalCost()  
//     })
// })
// bthMinus.forEach((el)=>{
//     el.addEventListener('click', ()=>{
//         let index = [...bthMinus].indexOf(el);
//         data.products[index].count = data.products[index].count - 1;
//         forOrder[index].textContent = data.products[index].count;  
//         if(data.products[index].count == 0){
//             deleteItem(index)
//         }
//         finalCost()
//     })
// })}bthOn()

// function deleteItem (index: number) {
//     if(data.products[index].count == 0){
//         data.products = [...data.products.slice(0, index), ...data.products.slice(index + 1)].reverse()
//         const leftColum = document.querySelector('.leftColum');
//         if (!leftColum) return;
//         leftColum.innerHTML = '';
//         for(let i = 0; i < data.products.length; i++){
//             repitMakeTable(data ,i)
//         }
//         bthOn()
//         } 
// }

// function finalCost (){
// const sumProducts = document.querySelector('.sum-products');
// const totalCosts =  document.querySelector('.total_cost');
// const blockWithPromo = `<spam>${arrayPromo} - 10%</spam>`;
// const priceItem = document.querySelectorAll('.price');
// const arrayCount = [];
// const arrayPrice = [];

// for(let i = 0; i< priceItem.length; i++){
//     arrayCount.push(data.products[i].count);
//     arrayPrice.push(data.products[i].price);
// }   
// if (sumProducts) {
//     sumProducts.innerHTML = `${arrayCount.reduce((a,b)=>{ return a+b})}`
// }
// const cartJSON = localStorage.getItem('cart');
// const cart = cartJSON ? JSON.parse(cartJSON) : [];
// const { sum, total } = cart.reduce(
//     (acc: { count: number; sum: number }, cartItem: CartItem) => {
//         acc.sum += cartItem.product.price * cartItem.count;
//         acc.count += cartItem.count;
//         return acc;
//     },
//     { total: 0, sum: 0 }
// );
// if (totalCosts) {
//     totalCosts.innerHTML = `Products: ${total}$` ; 
    
//     if(arrayPromo.length == 1){
//         totalCosts.innerHTML= `Total: ${Math.floor(total / 100 * 90)}$`;
//         // totalCosts.insertAdjacentHTML('afterend', blockWithPromo);
//     }else if(arrayPromo.length == 2){
//         totalCosts.innerHTML= `Total: ${Math.floor(total  / 100 * 80)}$`;
//         // totalCosts.insertAdjacentHTML('afterend', blockWithPromo);
//     }
// }

// }finalCost()
     
// function promocodeOn () {
//   const promocode = document.querySelector('.promocode');
//   if (promocode instanceof HTMLInputElement) {
//     promocode.oninput = () =>{
//         if(promocode.value == 'RS' || promocode.value == 'EPAM'){
//             const blockSubmitPromo = `<div class = 'blockSubmitPromo'>${promocode.value} - 10% <button class='add-promo'>add</button></div>`;
//             promocode.insertAdjacentHTML('afterend', blockSubmitPromo)
//             promocodeADD()
//         }else{
//           const submitPromoContainer = document.querySelector('.blockSubmitPromo')
//           if (submitPromoContainer) {
//             submitPromoContainer.remove()
//           }
//         }

//         } 
//   }

// }promocodeOn()

// function promocodeADD(){
//   const addPromo = document.querySelector('.add-promo');
//   const promocode = document.querySelector('.promocode');
//   if (!(promocode instanceof HTMLInputElement) || !addPromo) return;
//   const blockWithPromo = `<spam class='promo${arrayPromo.length}'>${promocode.value} - 10%<button class='bth-drop${arrayPromo.length}'>drop</button></spam>`;
//   const totalCost = document.querySelector('.total_cost');
//   const isPromo = arrayPromo.every(el => el !== promocode.value)
//   if(isPromo){
//       addPromo.addEventListener('click', ()=>{
//       arrayPromo.push(promocode.value);
//       finalCost()
//       if (totalCost) {
//         totalCost.insertAdjacentHTML('afterend', blockWithPromo);
//       }
//       const submitPromo = document.querySelector('.blockSubmitPromo');
//       if (submitPromo) {
//         const blockPromo = document.querySelector('.blockSubmitPromo');
//         if (blockPromo) {
//             submitPromo.remove();
//         }
//       }
      
//       promocode.value="";
//       promocodeDrop()
//       }
//   )}else{alert('you used this promo')}
// }

// function promocodeDrop(){
//     const drop0 = document.querySelector('.bth-drop0');
//     if (drop0) {
//         drop0.addEventListener('click', ()=>{
//             const promo0 = document.querySelector('.promo0');
//             if (promo0) {
//                 promo0.remove();
//                 arrayPromo.shift()
//                 finalCost()
//             }
//         })
//     }

    
//     const drop1 = document.querySelector('.bth-drop1');
//     if(drop1){
//     drop1.addEventListener('click', ()=>{
//         const promo1 = document.querySelector('.promo1');
//         if (promo1) {
//             promo1.remove();
//             arrayPromo.pop()
//             finalCost()
//         }
//     })}
// }        

// const bthBuyNow = document.querySelector('.bth-buy-now');

// if (bthBuyNow instanceof HTMLButtonElement) {
//     bthBuyNow.addEventListener('click', ()=>{
//         const blockCreditCard = `
//         <div>
//         <div><span class='type-card'></span><input placeholder="Card number" type="number" class="cardnumber"><span class='error error-card'></span></div>
//         <div class='wrapper-valid'><input placeholder='00/00' class='valid' type='text' maxlength='5'><span class='error error-valid'></span></div>
//         <div><input placeholder="Code" type="number" class="cvv"><span class='error error-code'></span></div>
//         </div>
//         `;
//         const BlockBuyNow = 
//         `<div class='overflow'>
//             <div class='main-buy-now'>
//             <h2>Personal details</h2>
//             <div><input placeholder="Name" type="text" class="name"><span class='error error-name'></span></div>
//             <div><input placeholder="PhoneNumber" type="number"  class="phone"><span class='error error-phone'></span></div>
//             <div><input placeholder="Adress" type="text" class="adress"><span class='error error-adress'></span></div>
//             <div><input placeholder="E-mail" type="email" min='000' max='999' class="mail"><span class='error error-mail'></span></div>
//             <h2>Credit card details</h2>
//             <div class='credit-catd'>
//             ${blockCreditCard}
//             </div>
//             <button type="submit" class='bth-submit'>Submit</button>
//             <div>
//         </div>`;
//         if (container) {
//             container.insertAdjacentHTML('afterbegin', BlockBuyNow)
//         }
              

//         function nameValid (){
//             const name = document.querySelector('.name');
//             if (!(name instanceof HTMLInputElement)) return;  
//             name.oninput = () =>{
//                 const str = (name.value).split(' ');
//                 const errorName = document.querySelector('.error-name');
//                 if (!errorName) return;
//                 if(str[0].length<3 || str[1].length<3){
//                     errorName.innerHTML ='ERROR'
//                 }else{errorName.innerHTML =''}
//             }
//         }nameValid()

//         function phoneValid () {
//             const phone = document.querySelector('.phone')
//             if (!(phone instanceof HTMLInputElement)) return;
//             phone.oninput = () =>{
//                 const number = (phone.value).split('').map(el=>+el);
//                 const errorName = document.querySelector('.error-phone');
//                 if (!errorName) return;
//                 if(number.length < 9 || phone.value[0] === undefined){
//                     errorName.innerHTML = "ERROR"
//                 }else(errorName.innerHTML = "")
//             }
//         }phoneValid()

//         function adressValid(){
//             const adres = document.querySelector('.adress'); 
//             if (!(adres instanceof HTMLInputElement)) return;
//             adres.oninput = () =>{
//                const arrayAdress = adres.value.trim().split(' ');
//                 const isTrue = arrayAdress.every(el=> el.length > 2)
//                 const errorAddress = document.querySelector('.error-adress');
//                 if (!errorAddress) return;
//                if(!isTrue || arrayAdress.length < 3){
//                 errorAddress.innerHTML = "ERROR"
//             }else(errorAddress.innerHTML = "")
//                }
//         }adressValid()


//         function mailValid(){
//         const email = document.querySelector('.mail');
//         if (!( email instanceof HTMLInputElement)) return;
//          email.oninput = () => {
//             const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
//             const errorEmail = document.querySelector('.error-mail');
//             if (!errorEmail) return;
//             if (EMAIL_REGEXP.test(email.value)) {
//                 errorEmail.innerHTML = ""
//           } else {
//             errorEmail.innerHTML = "ERROR"
//           }
//         }};mailValid()

//         function cardValid (){
//             const card = document.querySelector('.cardnumber');
//             const typeCard = document.querySelector('.type-card');
//             if (!(card instanceof HTMLInputElement) || !typeCard) return;
//             card.oninput= () =>{

//                 switch (card.value[0]) {
//                     case '3':
//                         typeCard.innerHTML = 'Maestro';
//                       break;
//                     case '4':
//                         typeCard.innerHTML = 'Visa';
//                       break;
//                     case '5':
//                         typeCard.innerHTML = 'MasterCard';
//                       break;
//                   };
//                 const errorCard = document.querySelector('.error-card');
//                 if (!errorCard) return;
//                if(card.value.length < 12){
//                 errorCard.innerHTML = 'ERROR'
//                }else{errorCard.innerHTML = ''}
               
//             }
//         }cardValid ()

//         function expirationDate () {
//             const cardData = document.querySelector('.valid');
//             if (!(cardData instanceof HTMLInputElement)) return;
//             cardData.oninput = (e) =>{
//                 const month = +cardData.value.slice(0,2) <= 31 && +cardData.value.slice(0,2) != 0;
//                 const year = +cardData.value.slice(3) <= 12 && +cardData.value.slice(3) != 0;
//                 const target = e.target;
//                 if (!(target instanceof HTMLInputElement)) return;
//                 const value = target.value.length > 2 ? target.value.slice(0, 2) + target.value.slice(3) : target.value
//                 if (isNaN(+value)){
//                     target.value = target.value.slice(0, target.value.length - 1)
//                 }
//                 if(cardData.value.length === 2){
//                     cardData.value += '/';
//                 }
//                 const errorCardData = document.querySelector('.error-valid');
//                 if (!errorCardData) return;
//                 if(!(cardData.value.length > 4 && month && year)){
//                     errorCardData.innerHTML = 'ERROR'
//                    }else{errorCardData.innerHTML = ''}
//             }
//         }expirationDate ()



//         function codeValid(){
//             const cvv = document.querySelector('.cvv');
//             if (!(cvv instanceof HTMLInputElement)) return;
//             cvv.oninput = () =>{
//                 const errorCode = document.querySelector('.error-code');
//                 if (!errorCode) return;
//                 if(cvv.value.length < 3){
//                     errorCode.innerHTML = 'ERROR'
//                 }else{errorCode.innerHTML = ''}
//             }
//            return cvv.value 
//         }codeValid()
//         const btnSubmit = document.querySelector('.bth-submit');
//         if (btnSubmit instanceof HTMLButtonElement) {
//             btnSubmit.addEventListener('click', ()=>{
//                 const cvv = document.querySelector('.cvv');
//                 const cardData = document.querySelector('.valid');
//                 const card = document.querySelector('.cardnumber');
//                 const email = document.querySelector('.mail');
//                 const adres = document.querySelector('.adress'); 
//                 const phone = document.querySelector('.phone');
//                 const name = document.querySelector('.name');
                
//     //    document.querySelector('.error-card').innerHTML = 'ERROR'} 
//     //        document.querySelector('.error-mail').innerHTML = "ERROR"}
//     //        document.querySelector('.error-adress').innerHTML = 'ERROR'}
//     //                document.querySelector('.error-valid').innerHTML = 'ERROR'}
//     //document.querySelector('.error-code').innerHTML = 'ERROR'} 
//     //        document.querySelector('.error-phone').innerHTML = 'ERROR'}
//                 let array = [document.querySelector('.cvv'),
//                 document.querySelector('.valid'),
//                 //ent.querySelector('.cardnumber'),
//                  document.querySelector('.mail'),
//                 //cument.querySelector('.adress'),
//                 document.querySelector('.phone'),
//                  document.querySelector('.name'),];
//                  const isTrue =array.every(el => el?.textContent ? +el.textContent >0 : false);
//                 const error = document.querySelectorAll('.error')
//                 if (error instanceof NodeList) {
//                     if([...error].every(el => el.textContent != "ERROR")){alert('ваш зака принят')
//                     data.products = []}
//                     // if(error.forEach(el => {console.log(el.textContent != "ERROR")})){alert('ваш зака принят')
//                     // data.products = []}
//                 }

    
//             }) 
//         }

// })
// }


//   //    let arrayPrice = [...data.products].reverse()
//         //    priceItem[index].textContent = +priceItem[index].textContent.slice(0, -1) - arrayPrice[index].price +'$';
//         //    totalCost();
//         //    let indexSpeshl = [...bthMinus].reverse().indexOf(el);
//         //    if(forOrder[index].textContent == 0){
//         //     deleteItem(data, indexSpeshl)
//         //     }
//     }
// }

