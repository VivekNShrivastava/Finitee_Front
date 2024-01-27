import { CreatedByDto } from "../user/createdByDto";

export class CommentDto {
    Id?: string = "";
    IsEdited: boolean = false;
    PostId?: string;
    CommentText: string = "";
    CommentReplies!: Array<CommentReplyDto>;
    CreatedOn!: any;
    CreatedBy!: CreatedByDto;
    FavourCount: number = 0;
    FavouredByCU: boolean = false;
    CommentReplyCount: number = 0;
    showReply: string = "";
    topThreeReplies!: Array<CommentReplyDto>;
}

export class CommentReplyDto {
    Id?: string = "";
    IsEdited: boolean = false;
    CommentId?: string;
    ReplyText: string = "";
    CreatedOn!: any;
    CreatedBy!: CreatedByDto;
    FavourCount: number = 0;
    FavouredByCU: boolean = false;
}
