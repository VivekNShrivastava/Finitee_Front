import { registerPlugin } from "@capacitor/core";
import type { VideoCropperPlugin } from "./definitions";

const VideoCropper = registerPlugin<VideoCropperPlugin>(
    'VideoCropper',
);

export * from './definitions';
export { VideoCropper };