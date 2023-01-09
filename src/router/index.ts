import { URLRoute } from './types';
import { Controller } from '../types/index';
import { MainController } from '../controllers/main';
import { DetailController } from '../controllers/detail';

const routes: URLRoute = {
    404: {
        template: '../pages/404.html',
        title: 'Ничего не нашли :(',
        description: 'Ничего не нашли :(',
        controller: null,
    },
    '/': {
        template: '../pages/main.html',
        title: 'Онлайн магазин',
        description: 'Купи чё хочешь',
        controller: new MainController(),
    },
    '/cart': {
        template: '../pages/cart.html',
        title: 'Корзина',
        description: 'Твоя корзиночка',
        controller: new MainController(),
    },
    '/detail': {
        template: '../pages/detail.html',
        title: 'Корзина',
        description: 'Твоя корзиночка',
        controller: new DetailController(),
    },
};

const links = document.querySelectorAll('.router-link');
for (const link of links) {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target;
        const href = link.closest('.router-link');
        if (!target || !(href instanceof HTMLAnchorElement)) return;
        urlRoute(e);
    });
}

const urlRoute = (e: Event) => {
    e = e || window.event;
    if (e) {
        e.preventDefault();
        const target = e.target;
        if (target && (target instanceof HTMLElement || target instanceof SVGElement)) {
            const href = target.closest('.router-link');
            if (e.target && href instanceof HTMLAnchorElement) {
                console.log(href.href);
                
                window.history.pushState({}, '', href.href);
                urlLocationHandler();
            }
        }
    }
};

const urlLocationHandler = async () => {
    let location = window.location.pathname;
    console.log(location);
    
    if (location.length === 0) {
        location = '/';
    }
    if (location.includes('detail')) {
        location = '/detail';
    }
    const route = routes[location] || routes[404];
    const html = await fetch(route.template).then((resp) => resp.text());
    const root = document.getElementById('app');
    if (root) {
        root.innerHTML = html;
        document.title = route.title;
        if (route.controller) {
            route.controller.init();
        }
        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute('content', route.description);
        }
    }
};

const push = (path: string | number) => {
    const href = window.location.origin + path.toString();
    window.history.pushState({}, '', href);
    urlLocationHandler();
}

const router = {
    urlLocationHandler,
    routes,
    urlRoute,
    push
};
export default router;
