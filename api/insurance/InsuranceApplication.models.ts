export interface InsuranceApplication {
    id?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    dateOfBirth?: Date | null;
    address?: Address | null;
    vehicles?: Vehicle[] | null;
    people?: Person[] | null;
}

export interface Address {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zipCode?: string | null;
}

export interface Vehicle {
    id?: string | null;
    vin?: string | null;
    year?: number | null;
    make?: string | null;
    model?: string | null;
}

export interface Person {
    id?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    dateOfBirth?: Date | null;
    relationship?: string | null;
}

export type QuoteFactors = {
    basePrice: number;
    ageMultiplier: number;
    vehicleMultiplier: number;
    peopleMultiplier: number;
};

export interface BaseInsuranceApplicationRequest {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    address: Address;
    vehicles: Vehicle[];
    people: Person[];
}

export interface CreateInsuranceApplicationRequest extends BaseInsuranceApplicationRequest {}

export interface UpdateInsuranceApplicationRequest extends BaseInsuranceApplicationRequest {
    id?: string;
}

export interface CreateApplicationResponse {
    application: InsuranceApplication;
    resumeUrl: string;
}
