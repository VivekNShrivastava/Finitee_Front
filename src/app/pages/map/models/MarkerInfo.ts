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
    Sales = "Sales"
}
