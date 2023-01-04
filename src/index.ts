import '../assets/style/style.scss';
import router from './router';
import { URLRoute } from './router/types';

window.onpopstate = router.urlLocationHandler;
declare global {
    interface Window {
        route: URLRoute;
    }
}
const w = window;
w.route = router.routes;
router.urlLocationHandler();
