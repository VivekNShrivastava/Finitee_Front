export class MarkerInfo<T> {
    data?: T;
    MarkerType?: MarkerType;
    itemIndex: number = -1;
}

export enum MarkerType {
    FiniteeService = "FiniteeService",
    SavedLocation = "SavedLocation",
    Totem = "Totem",
    FreeUser = "FreeUser",
    BusinessNonProfitUser = "BusinessNonProfitUser",
    Sales = "Sales",
    Event = "Event",
    Multiple = "Multiple"
}

export class MultipleMarkerInfo<T> {
    data?: any[];
    MarkerType?: MarkerType;
    itemIndex: number = -1;
}
