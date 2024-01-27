export interface NotificationPayload<T> {
    title: string;
    body: string;
    data: T | undefined;
    sound: string | null;
    android_channel_id: string | null;
    icon: string | null;
    color: string | null;
    id: string | null;
    flag: string | null;
    ustypid: string | null;
    usertype: string | null;
    lat: number | null;
    lng: number | null;
    name: string | null;
    photo: string | null;
    frmid: string | null;
    toid: string | null;
    conid: string | null;
    pid: string | null;
    pusrid: string | null;
    pshrid: string | null;
    gid: string | null;
    gusrid: string | null;
    eid: string | null;
    flagid: string | null;
    nflag: string | null;
    nmsg: string | null;
    rusrid: string | null;
    islc: string | null;
}


export class InAppNotification {
    ToUserId: string = "";
    FromUserId: string = "";
    NotificationCode: number = 0;
    IsRead: boolean = false;
}