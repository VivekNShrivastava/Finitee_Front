import { registerPlugin } from "@capacitor/core";
import type { VideoCropperPlugin } from "./definitions";

const VideoCropper = registerPlugin<VideoCropperPlugin>(
    'VideoCropper',
    {
        web: () => import('./web').then(m => new m.VideoCropperWeb()),
    }
);

export * from './definitions';
export { VideoCropper };