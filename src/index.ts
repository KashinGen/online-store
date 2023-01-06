import '../assets/style/style.scss';
import router from './router';
import { URLRoute } from './router/types';
import { Controller } from './types/index';

window.onpopstate = router.urlLocationHandler;
declare global {
    interface Window {
        route: URLRoute;
        controller: Controller;
    }
}
const w = window;
w.route = router.routes;
router.urlLocationHandler();
