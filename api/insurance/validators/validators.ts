import { InsuranceApplication, Address, Vehicle } from '../InsuranceApplication.models';
import { Validator, ValidationRule, ValidationError } from './types';

// Reusable validation rules
const required = (fieldName: string): ValidationRule<any> => ({
    test: (value: any) => value != null && value !== '',
    message: `${fieldName} is required`,
});

const minAge = (age: number): ValidationRule<Date> => ({
    test: (date: Date) => {
        const today = new Date();
        let yearDiff = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
            yearDiff--;
        }
        return yearDiff >= age;
    },
    message: `Must be at least ${age} years old`,
});

const zipCodeFormat: ValidationRule<string> = {
    test: (value: string) => /^\d{5}$/.test(value),
    message: 'Invalid zip code format (must be 5 digits)',
};

const vehicleYearRange: ValidationRule<number> = {
    test: (year: number) => {
        const currentYear = new Date().getFullYear();
        return year >= 1985 && year <= currentYear + 1;
    },
    message: 'Vehicle year must be between 1985 and next year',
};

// Specific validators
export const addressValidator: Validator<Address> = {
    validate: (address: Address) => {
        const errors: ValidationError[] = [];

        if (!required('Street').test(address.street)) {
            errors.push({ field: 'address.street', message: required('Street').message });
        }
        if (!required('City').test(address.city)) {
            errors.push({ field: 'address.city', message: required('City').message });
        }
        if (!required('State').test(address.state)) {
            errors.push({ field: 'address.state', message: required('State').message });
        }
        if (!required('Zip code').test(address.zipCode)) {
            errors.push({ field: 'address.zipCode', message: required('Zip code').message });
        } else if (!zipCodeFormat.test(address.zipCode!)) {
            errors.push({ field: 'address.zipCode', message: zipCodeFormat.message });
        }

        return errors;
    },
};

export const vehicleValidator: Validator<Vehicle> = {
    validate: (vehicle: Vehicle) => {
        const errors: ValidationError[] = [];

        if (!required('VIN').test(vehicle.vin)) {
            errors.push({ field: 'vehicle.vin', message: required('VIN').message });
        }
        if (!required('Make').test(vehicle.make)) {
            errors.push({ field: 'vehicle.make', message: required('Make').message });
        }
        if (!required('Model').test(vehicle.model)) {
            errors.push({ field: 'vehicle.model', message: required('Model').message });
        }
        if (!required('Year').test(vehicle.year)) {
            errors.push({ field: 'vehicle.year', message: required('Year').message });
        } else if (!vehicleYearRange.test(vehicle.year!)) {
            errors.push({ field: 'vehicle.year', message: vehicleYearRange.message });
        }

        return errors;
    },
};

export const applicationValidator: Validator<InsuranceApplication> = {
    validate: (application: InsuranceApplication) => {
        const errors: ValidationError[] = [];

        // Personal info validation
        if (!required('First name').test(application.firstName)) {
            errors.push({ field: 'firstName', message: required('First name').message });
        }
        if (!required('Last name').test(application.lastName)) {
            errors.push({ field: 'lastName', message: required('Last name').message });
        }
        if (!required('Date of birth').test(application.dateOfBirth)) {
            errors.push({ field: 'dateOfBirth', message: required('Date of birth').message });
        } else if (!minAge(16).test(new Date(application.dateOfBirth!))) {
            errors.push({ field: 'dateOfBirth', message: minAge(16).message });
        }

        // Address validation
        if (application.address) {
            errors.push(...addressValidator.validate(application.address));
        } else {
            errors.push({ field: 'address', message: 'Address is required' });
        }

        // Vehicles validation
        if (!application.vehicles || application.vehicles.length === 0) {
            errors.push({ field: 'vehicles', message: 'At least one vehicle is required' });
        } else if (application.vehicles.length > 3) {
            errors.push({ field: 'vehicles', message: 'Maximum of 3 vehicles allowed' });
        } else {
            application.vehicles.forEach((vehicle, index) => {
                const vehicleErrors = vehicleValidator.validate(vehicle);
                errors.push(
                    ...vehicleErrors.map((error) => ({
                        field: `vehicles[${index}].${error.field.replace('vehicle.', '')}`,
                        message: error.message,
                    }))
                );
            });
        }

        // People validation (if any)
        if (application.people && application.people.length > 0) {
            application.people.forEach((person, index) => {
                if (!required('First name').test(person.firstName)) {
                    errors.push({
                        field: `people[${index}].firstName`,
                        message: required('First name').message,
                    });
                }
                if (!required('Last name').test(person.lastName)) {
                    errors.push({
                        field: `people[${index}].lastName`,
                        message: required('Last name').message,
                    });
                }
                if (!required('Date of birth').test(person.dateOfBirth)) {
                    errors.push({
                        field: `people[${index}].dateOfBirth`,
                        message: required('Date of birth').message,
                    });
                } else if (!minAge(16).test(new Date(person.dateOfBirth!))) {
                    errors.push({
                        field: `people[${index}].dateOfBirth`,
                        message: minAge(16).message,
                    });
                }
                if (!required('Relationship').test(person.relationship)) {
                    errors.push({
                        field: `people[${index}].relationship`,
                        message: required('Relationship').message,
                    });
                }
            });
        }

        return errors;
    },
};
