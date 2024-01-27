
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'replyText'
})
export class replyTextPipe implements PipeTransform {
    transform(text: string, commentId: any, commentUserId: any): string {
        var textSplit = text.split("@@");
        var replyToId = textSplit[0];
        var replyToUserId = textSplit[1];
        var replyToUserType = textSplit[2];
        var replyToDsiplayName = textSplit[3];
        var textTobeHighLighted = "";
        if (commentId != replyToId)// && commentUserId != replyToUserId
            textTobeHighLighted += "<a (click)='openProfile(replyToId,replyToUserType)'>" + replyToDsiplayName + "</a>";
        return textTobeHighLighted += textSplit[4];
    }


}