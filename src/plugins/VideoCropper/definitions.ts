import type { PluginListenerHandle } from "@capacitor/core";

export interface VideoCropperPlugin{

    getContacts(): Promise<{ type:  any[]}>
}