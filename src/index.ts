import '../assets/style/style.scss';
import router from './router';
import { updateCartInfo } from './util';

window.onpopstate = router.urlLocationHandler;
updateCartInfo();
const w = window;
w.route = router.routes;
router.urlLocationHandler();
