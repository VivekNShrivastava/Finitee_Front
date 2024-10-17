import type { PluginListenerHandle } from "@capacitor/core";

export interface VideoCropperPlugin{

    getContacts(filter: string): Promise<{ results:  any[]}>
}