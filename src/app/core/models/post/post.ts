import { AppConstants } from "../config/AppConstants";
import { CreatedByDto } from "../user/createdByDto";

export class Post {
    Id: string = "";
    IsEdited: boolean = false;
    Type: string = AppConstants.POST_TYPE.USER;
    Title: string = "";
    PostDescription: string = "";
    Privacy: string = "";
    PostTraits: Array<string> = [];
    PostImages: Array<string> = [];
    showFullDescription = false;
    BelongsToId?: string;
    BelongsToNodeName: string = "";
    CommentCount: number = 0;
    FavourCount: number = 0;
    BeamCount: number = 0;
    FavouredByCU: boolean = false;
    CreatedOn!: any;
    CreatedBy!: CreatedByDto;
    BeamedFromUser!: CreatedByDto;
}

export class AddPostRequest {
    post!: Post;
    media!: Media;
}

export class Media {
    images?: ImageFinitee[];
    videos?: VideoFinitee[];
}

export class ImageFinitee {
    imageFile!: File;
    serialNumber!: number;
}

export class VideoFinitee {
    videoFile!: File;
    thumbnail!: File;
    serialNumber!: number;
}