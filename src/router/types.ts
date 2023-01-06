import { Controller } from "../types";

export interface URLRoute {
    [key: string | number]: {
        template: string;
        title: string;
        description: string;
        controller: Controller | null;
    }
}