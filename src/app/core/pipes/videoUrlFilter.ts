
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'videoUrlFilter'
})
export class videoUrlFilter implements PipeTransform {
    transform(url: string): string {
        var urlSplit = url.split("VIDEO_Thumb_");
        var videoThumb = urlSplit[1];
        var videoThumbSplit = videoThumb.split(".");
        return urlSplit[0] + videoThumbSplit[0] + ".mp4";
    }


}