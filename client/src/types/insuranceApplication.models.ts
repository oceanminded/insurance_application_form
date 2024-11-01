export interface Vehicle {
    id?: string;
    vin?: string;
    year?: number;
    make?: string;
    model?: string;
}

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

export interface People {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    relationship: 'Spouse' | 'Sibling' | 'Parent' | 'Friend' | 'Other';
}

export interface InsuranceApplication {
    id?: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: Address;
    vehicles: Vehicle[];
    people: People[];
}
