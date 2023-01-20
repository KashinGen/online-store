import '../assets/style/style.scss';
import router from './router';
import { URLRoute } from './router/types';
import { CartItem, Controller } from './types/index';
import { updateCartInfo } from './util';

window.onpopstate = router.urlLocationHandler;
// declare global {
//     interface Window {
//         route: URLRoute;
//         controller: Controller;
//     }
// }
updateCartInfo();
const w = window;
w.route = router.routes;
router.urlLocationHandler();
