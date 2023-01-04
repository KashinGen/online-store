import { URLRoute } from './types';
const routes: URLRoute = {
    404: {
        template: '../pages/404.html',
        title: 'Ничего не нашли :(',
        description: 'Ничего не нашли :(',
    },
    '/': {
        template: '../pages/main.html',
        title: 'Онлайн магазин',
        description: 'Купи чё хочешь',
    },
    '/cart': {
        template: '../pages/cart.html',
        title: 'Корзина',
        description: 'Твоя корзиночка',
    },
};

const links = document.querySelectorAll('.router-link');
for (const link of links) {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target;
        const href = link.closest('.router-link');
        console.log(href);
        console.log(href instanceof HTMLAnchorElement);
        if (!target || !(href instanceof HTMLAnchorElement)) return;
        if (!href.matches('a')) return;
        urlRoute(e);
    });
}

const urlRoute = (e: Event) => {
    e = e || window.event;
    if (e) {
        e.preventDefault();
        const target = e.target;
        if (target && target instanceof HTMLElement) {
            const href = target.closest('.router-link');
            if (e.target && href instanceof HTMLAnchorElement) {
                window.history.pushState({}, '', href.href);
                urlLocationHandler();
            }
        }
    }
};

const urlLocationHandler = async () => {
    let location = window.location.pathname;
    if (location.length === 0) {
        location = '/';
    }
    const route = routes[location] || routes[404];
    const html = await fetch(route.template).then((resp) => resp.text());
    const root = document.getElementById('app');
    if (root) {
        root.innerHTML = html;
        document.title = route.title;
        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute('content', route.description);
        }
    }
};

const router = {
    urlLocationHandler,
    routes,
    urlRoute,
};
export default router;
