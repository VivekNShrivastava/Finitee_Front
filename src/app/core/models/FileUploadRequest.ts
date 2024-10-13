import { SafeUrl } from "@angular/platform-browser";

export interface FileUploadRequest {
    data: string;
    status: 'P' | 'V';
    filepath: string;
    name: string;
    blob: Blob;
    blobUrl: SafeUrl;
    thumbnail?: any[];
}

export interface FileUploadRequestNew {
    mediaType: string;
    name: string;
    filePath: string;
}