export class Announcement {
    Id: string = "";
    UserId?: string;
    AnnouncementDescription: string = "";
    AnnouncementTitle: string = "";
    CreatedOn: Date = new Date;
    Images: Array<string> = [];
    IsActive: boolean = true;
}