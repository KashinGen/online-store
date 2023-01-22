import CartItemComponent from '../components/CartItem';
import { cartModel } from '../models/cartModel';
import router from '../router';
import { CartAction, CartItem, Controller, Promo } from '../types';
import { setURLParams, updateCartInfo } from '../util';
import { CartView } from '../view/cartView';
import CartModel from '../models/Cart';
import OrderModal from '../components/OrderModal';

export class CartController extends Controller {
    _view: CartView | null = null;
    _model: cartModel;
    _orderModal: OrderModal | null = null;
    cartToShow: CartItem[] = [];
    constructor() {
        super();
        this._model = new cartModel();
    }

    init() {
        this.getCartToShow();
        this.getURLParams();
        const root = document.querySelector('.cart__inner');
        if (root instanceof HTMLElement) {
            this._view = new CartView(this, root);
        }
        this.render();
        const isButOneClick = localStorage.getItem('buy-one-click');
        const modalRoot = document.querySelector('.modal');
        if (modalRoot instanceof HTMLElement) {
            this._orderModal = new OrderModal(this.onSubmitHandler.bind(this), {
                selector: modalRoot,
                template: '',
            });
        }
        if (isButOneClick) {
            this.openModal();
            localStorage.removeItem('buy-one-click');
        }
    }

    getURLParams(): void {
        const searchParams = new URLSearchParams(window.location.search);
        const limit = searchParams.get('limit');
        const page = searchParams.get('page');
        const cart = CartModel.getCart();
        const allPages = this._model.getAllPages();
        if (limit) {
            const selectedLimit = +limit <= cart.length && +limit >= 1 ? +limit : cart.length;
            this._model.setLimit(selectedLimit);
        }
        if (page) {
            let selectedPage = +page;
            if (selectedPage < 1) {
                selectedPage = 1;
            }
            if (selectedPage > allPages) {
                selectedPage = allPages;
            }
            this._model.setCurrentPage(selectedPage);
        }
        this.getCartToShow();
    }

    getCartToShow() {
        const cart = CartModel.getCart();
        const currentPage = this._model.getCurrentPage();
        const limit = this._model.getLimit();
        this.cartToShow = cart.slice((currentPage - 1) * limit, currentPage * limit);
        const allPages = Math.ceil(cart.length / limit);
        this._model.setAllPages(allPages);
    }
    onSubmitHandler() {
        alert('Ваш заказ принят');
        localStorage.removeItem('cart');
        this._orderModal && this._orderModal.hide();
        document.querySelector('.overflow')?.remove();
        setTimeout(() => {
            this._orderModal && this._orderModal.hide();
            this._model.clearCart();
            this.render();
            updateCartInfo();
            router.push('/');
        }, 3000);
    }

    openModal() {
        this._orderModal && this._orderModal.render();
    }

    render() {
        this.getCartToShow();
        this._view && this._view.render();
    }

    onPromoInputHandler(value: string) {
        const promo = this._model.getPromo();
        const index = promo.findIndex((promo) => promo.code === value);
        if (this._view) {
            this._view.renderFoundPromo(promo[index] ? promo[index] : null);
        }
    }

    onPromoAddHandler(promo: Promo) {
        this._model.addPromo(promo);
        if (this._view) {
            this._view.renderCompletedPromo();
            this._view.renderFoundPromo(null);
        }
        const input = document.querySelector('.cart__promo-input');
        if (input instanceof HTMLInputElement) {
            input.value = '';
        }
        this.setSale();
    }

    onPromoDeleteHandler(promo: Promo) {
        this._model.removePromo(promo);
        if (this._view) {
            this._view.renderCompletedPromo();
            this._view.renderFoundPromo(null);
        }
        this.setSale();
    }

    onChangeCartCount(cart_item: CartItemComponent, action: CartAction) {
        const cart = CartModel.getCart();
        const index = cart.findIndex((item) => item.product.id === cart_item.cartItem.product.id);
        if (index === -1) return;
        if (action === CartAction.DECREASE) {
            CartModel.removeFromCart(cart[index].product);
            this.getCartToShow();
            updateCartInfo();
            if (this.cartToShow.length === 0) {
                const current = this._model.getCurrentPage();
                if (current > 1) {
                    this._model.setCurrentPage(current - 1);
                }
            }
        }
        if (action === CartAction.INCREASE) {
            CartModel.addToCart(cart[index].product);
        }
        this.getCartToShow();
        if (this._view) {
            this._view.render();
            this._view.renderCompletedPromo();
        }
        this.setSale();
    }

    onLimitInputHandler(value: string) {
        const cart = CartModel.getCart();
        const input = document.querySelector('.cart__limit-number');
        if (+value > cart.length) {
            value = cart.length.toString();
            this._model.setLimit(+value);
        } else if (+value < 1) {
            if (input instanceof HTMLInputElement) {
                input.value = '1';
            }
            this._model.setLimit(1);
        } else {
            this._model.setLimit(+value);
        }
        let leftContainer = document.querySelector('.cart__left');
        this._model.setCurrentPage(1);
        this.getCartToShow();
        const current = this._model.getCurrentPage();
        const limit = this._model.getLimit();
        setURLParams('page', current.toString());
        setURLParams('limit', limit.toString());
        if (leftContainer instanceof HTMLElement && this._view) {
            this._view.renderCartItems(leftContainer);
        }
        const currentPage = document.querySelector('.cart__pagination-wrapper span');
        if (currentPage) {
            currentPage.innerHTML = current.toString();
        }
    }

    onPrevClickHandler() {
        const currentPage = this._model.getCurrentPage();
        if (currentPage === 1) return;
        this._model.setCurrentPage(currentPage - 1);
        this.getCartToShow();
        const current = document.querySelector('.cart__pagination-wrapper span');
        if (current) {
            current.innerHTML = this._model.getCurrentPage().toString();
        }
        let leftContainer = document.querySelector('.cart__left');
        if (leftContainer instanceof HTMLElement && this._view) {
            this._view.renderCartItems(leftContainer);
        }
        setURLParams('page', this._model.getCurrentPage().toString());
    }

    onNextBtnClickHandler() {
        const currentPage = this._model.getCurrentPage();
        const allPages = this._model.getAllPages();
        if (currentPage === allPages) {
            return;
        }
        this._model.setCurrentPage(currentPage + 1);
        this.getCartToShow();
        let leftContainer = document.querySelector('.cart__left');
        const current = document.querySelector('.cart__pagination-wrapper span');
        if (current) {
            current.innerHTML = this._model.getCurrentPage().toString();
        }
        if (leftContainer instanceof HTMLElement && this._view) {
            this._view.renderCartItems(leftContainer);
        }
        setURLParams('page', this._model.getCurrentPage().toString());
    }

    setSale() {
        this._model.setSale();
        const sale = CartModel.getSale();
        const sumWithSale = CartModel.getSumWithSale();
        const infoContainer = document.querySelector('.cart__info');
        if (infoContainer) {
            const oldPrice = infoContainer.querySelector('.cart__total-sum');
            if (oldPrice instanceof HTMLElement) {
                if (sale === 0) {
                    oldPrice.classList.remove('old');
                } else {
                    oldPrice.classList.add('old');
                }
                let newPriceContainer = document.querySelector('.cart__total-sum--new');
                if (!newPriceContainer && sale !== 0) {
                    newPriceContainer = document.createElement('div');
                    newPriceContainer.classList.add('cart__total-sum', 'cart__total-sum--new');
                    newPriceContainer.innerHTML = `Сумма со скидкой: <span>${sumWithSale}</span> €`;
                    infoContainer.prepend(newPriceContainer);
                }
                if (newPriceContainer) {
                    newPriceContainer.innerHTML = `Сумма со скидкой: <span>${sumWithSale}</span> €`;
                    if (sale === 0) {
                        newPriceContainer.remove();
                        infoContainer.removeChild(newPriceContainer);
                    }
                }
            }
        }
    }
}
