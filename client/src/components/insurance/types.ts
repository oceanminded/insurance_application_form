export type ApplicationFormData = {
    firstName: string;
    lastName: string;
    dateOfBirth: Date | null;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    vehicles: {
        vin: string;
        year: number;
        make: string;
        model: string;
    }[];
    people: {
        firstName: string;
        lastName: string;
        relationship: string;
        dateOfBirth: Date | null;
    }[];
};
