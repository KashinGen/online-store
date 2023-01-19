declare global {
    interface Window {
        route: URLRoute;
        controller: Controller;
    }
}