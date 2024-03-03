export interface LatLong {
    latitude: number;
    longitude: number;
}

export interface AllSonarSearchRequest {
    geolocation: LatLong;
    searchKey: string;
    scope: number;
    freeUser: boolean;
    connections: boolean;
    businessUser: boolean;
    nonProfitUser: boolean;
    events: boolean;
    sales: boolean;
    serviceReq: boolean;
    serviceAvailable: boolean;
}
