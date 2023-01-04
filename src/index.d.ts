import { URLRoute } from './router/types';
declare global {
    interface Window {
        route: URLRoute;
    }
}
