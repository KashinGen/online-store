export function debounce<F extends (...params: Event[]) => void>(fn: F, delay: number) {
    let timeoutID: number | null = null;
    return function (this: Object, ...args: any[]) {
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
    } as F;
}
