import { Post } from "./post";

export class UserTrait {
    Id: string = "";
    Trait: string = "";
    CreatedOn!: any;
    Thumbnail: string = "";
}

export class UserTraitWithPost {
    UserTrait!: UserTrait;
    TraitPosts!: Array<Post>;
    LastPostData!: any;
}
