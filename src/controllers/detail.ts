import { getProduct } from '../api';
import Loader from '../components/Loader';
import { CartItem, Controller, Product } from '../types';

export class DetailController extends Controller {
    product: Product | null = null;
    activeImageIndex: number = 0;

    init() {
        const path = window.location.pathname.split('?')[0];
        const paths = path.split('/');
        const id = paths[paths.length - 1];
        this.getProductInfo(id);
    }

    async getProductInfo(id: string) {
        const root = document.querySelector('.detail__inner');
        if (root instanceof HTMLElement) {
            this.setLoading(root);
            const data = await getProduct(id);
            if (!data.id) {
                const divNotFound = document.createElement('div');
                divNotFound.className = 'detail__not-found';
                divNotFound.innerHTML = `Ой! Товар &nbsp;<span>${id}</span>&nbsp; не найден`;
                root.innerHTML = '';
                root.append(divNotFound);
            } else {
                this.product = data;
                root.innerHTML = '';
                this.renderBreadCrumb(root);
                this.renderProduct(root);
            }
        }
    }

    renderBreadCrumb(root: HTMLElement) {
        const breadCrumb = document.createElement('ul');
        breadCrumb.className = 'breadcrumb';
        breadCrumb.innerHTML = `
            <li class="breadcrumb__item">
                <a  class="breadcrumb__link router-link"
                    target="_blank" 
                    href="/"
                >Главная</a>
            </li>
            <li class="breadcrumb__item">
                <a  class="breadcrumb__link router-link"
                    target="_blank" 
                    href="/?categories=${this.product?.category}"
                >${this.product?.category}</a>
            </li>
            <li class="breadcrumb__item">
                <a  class="breadcrumb__link router-link"
                    target="_blank" 
                    href="/?brands=${this.product?.brand}"
                >${this.product?.brand}</a>
            </li>
            <li class="breadcrumb__item breadcrumb__item--last">
                <a  class="breadcrumb__link router-link"
                    target="_blank" 
                    href="/?q=${this.product?.title}"
                >${this.product?.title}</a>
            </li>`;
        root.appendChild(breadCrumb);
    }

    renderProduct(root: HTMLElement) {
        const wrapper = document.createElement('div');
        wrapper.className = 'product';
        const leftContainer = document.createElement('div');
        leftContainer.className = 'product__left';
        if (this.product) {
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'product__img-wrapper';
            const img = document.createElement('img');
            img.setAttribute('alt', this.product.title);
            img.src = this.product.images[this.activeImageIndex];
            img.className = 'product__img';
            imgWrapper.append(img);
            leftContainer.append(imgWrapper);
            const slidesWrapper = document.createElement('div');
            slidesWrapper.className = 'product__slides';
            for (let i = 0; i < this.product.images.length; i += 1) {
                const imgPath = this.product.images[i];
                if (!imgPath.includes('thumbnail')) {
                    const slide = document.createElement('div');
                    slide.className = 'product__slide';
                    const imgSlide = document.createElement('img');
                    imgSlide.setAttribute('alt', this.product.title);
                    imgSlide.src = imgPath;
                    if (i === this.activeImageIndex) {
                        slide.classList.add('active');
                    }
                    slide.appendChild(imgSlide);
                    slidesWrapper.appendChild(slide);
                    imgSlide.addEventListener('click', (e) => {
                        const target = e.target;
                        if (target instanceof HTMLImageElement) {
                            const src = target.getAttribute('src');
                            const prevActiveSlide = document.querySelector('.product__slide.active');
                            if (prevActiveSlide) {
                                prevActiveSlide.classList.remove('active');
                            }
                            target.closest('.product__slide')?.classList.add('active');
                            const bigImage = document.querySelector('.product__img');
                            if (bigImage instanceof HTMLImageElement && src) {
                                bigImage.src = src;
                            }
                        }
                    });
                }
            }
            leftContainer.appendChild(slidesWrapper);
            wrapper.appendChild(leftContainer);

            const rightContainer = document.createElement('div');
            rightContainer.className = 'product__info';
            const title = document.createElement('h1');
            title.className = 'product__title';
            title.innerHTML = this.product.title;
            rightContainer.append(title);
            const ratingContainer = document.createElement('div');
            ratingContainer.className = 'product__rating';
            ratingContainer.innerHTML = `
                <div>Рейтинг:</div>
                <div class="product-card__rating ${this.product.rating >= 4.5 ? 'blue' : ''}">
                    <span class='product-card__rating-star'></span>
                    <span class='product-card__rating-number'>${this.product.rating.toFixed(1)}</span>
                </div>`;
            rightContainer.append(ratingContainer);
            const charact = document.createElement('div');
            charact.className = 'product__characteristics';
            charact.innerHTML = `
                <ul class="product-card__info">
                    <li>
                        <span>Бренд</span>
                        <span></span>
                        <span>${this.product.brand}</span>
                    </li>
                    <li>
                        <span>Категория</span>
                        <span></span>
                        <span>${this.product.category}</span>
                    </li>
                    <li>
                        <span>В наличии</span>
                        <span></span>
                        <span>${this.product.stock} шт.</span>
                    </li>
            </ul>`;
            rightContainer.append(charact);
            const descriptionContainer = document.createElement('div');
            descriptionContainer.className = 'product__description';
            descriptionContainer.innerHTML = `
                <h3 class="product__description-title">Описание</h3>
                <div class="product__description-block">${this.product.description}</div>
            `;
            rightContainer.append(descriptionContainer);
            const controlsContainer = document.createElement('div');
            controlsContainer.className = 'product__controls';
            const price = document.createElement('div');
            price.className = 'product__price';
            price.innerHTML = this.product.price.toString() + ' €';
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'product__buttons';
            const btnBuyOneClick = document.createElement('button');
            btnBuyOneClick.addEventListener('click', () => {});
            btnBuyOneClick.innerHTML = 'Купить в 1 клик';
            const cartJSON = localStorage.getItem('cart');
            const cart = cartJSON ? JSON.parse(cartJSON) : [];
            const index = cart.findIndex((item: CartItem) => item.product.id === this.product?.id);
            const isInCart = index !== -1;
            const btnAddToCart = document.createElement('button');
            btnAddToCart.addEventListener('click', (e) => {
                const target = e.target;
                if (index !== -1) {
                    if (cart[index].product.stock > cart[index].count + 1) {
                        cart[index].count++;
                    }
                } else {
                    cart.push({
                        product: this.product,
                        count: 1,
                    });
                    if (target instanceof HTMLButtonElement) {
                        target.innerHTML = 'В корзине';
                    }
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                const cart_sum = document.querySelector('.header__cart-info-count span');
                const { sum, count } = cart.reduce(
                    (acc: { count: number; sum: number }, cartItem: CartItem) => {
                        acc.sum += cartItem.product.price * cartItem.count;
                        acc.count += cartItem.count;
                        return acc;
                    },
                    { count: 0, sum: 0 }
                );

                if (cart_sum) {
                    cart_sum.innerHTML = sum;
                }
                const cart_icon = document.querySelector('.header__cart-link');
                if (cart_icon) {
                    cart_icon.setAttribute('data-count', count);
                    if (count > 0) {
                        cart_icon.classList.add('on');
                    }
                }
            });
            btnAddToCart.innerHTML = isInCart ? 'В корзине' : 'В корзину';
            buttonsContainer.append(btnBuyOneClick, btnAddToCart);
            controlsContainer.append(price, buttonsContainer);
            rightContainer.append(controlsContainer);
            wrapper.appendChild(rightContainer);
        }
        root.append(wrapper);
    }

    setLoading(root: HTMLElement) {
        if (root) {
            const loaderWrapper = document.createElement('div');
            loaderWrapper.classList.add('loader');
            const loader = new Loader({
                selector: loaderWrapper,
                template: '',
            });
            root.innerHTML = '';
            root.append(loaderWrapper);
            loader.render();
        }
    }
}
