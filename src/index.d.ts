import '../assets/style/style.scss';
import { URLRoute } from './router/types';
import { Controller } from './types/index';
declare global {
    interface Window {
        route: URLRoute;
        controller: Controller;
    }
}
