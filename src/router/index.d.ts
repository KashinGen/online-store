import { URLRoute } from './types';
declare const router: {
    urlLocationHandler: () => Promise<void>;
    routes: URLRoute;
    urlRoute: (e: Event) => void;
    push: (path: string | number) => void;
};
export default router;
