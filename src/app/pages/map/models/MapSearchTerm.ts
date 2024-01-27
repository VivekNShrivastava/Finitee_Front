export interface MapSearchTerms {
    key: string;
    age: {
        MinAge: number;
        MaxAge: number;
    };
    km: number;
    type: string;
    bysl: null;
    pplr: string | null;
    isprt: 0 | 1;
}
