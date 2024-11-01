import { ApplicationFormData } from '../types';
import { ValidationRules } from './ValidationRules';
import { ValidationResult, ValidationErrors } from './types';

export class ApplicationValidator {
    static validate(data: ApplicationFormData): ValidationResult {
        const errors: ValidationErrors = {
            address: {},
            vehicles: [],
            people: [],
        };

        // Personal Information
        this.validatePersonalInfo(data, errors);

        // Address
        this.validateAddress(data.address, errors);

        // Vehicles
        this.validateVehicles(data.vehicles, errors);

        // Additional People
        this.validatePeople(data.people, errors);

        return {
            isValid: !this.hasErrors(errors),
            errors,
        };
    }

    private static validatePersonalInfo(data: ApplicationFormData, errors: ValidationErrors): void {
        const fields = ['firstName', 'lastName'] as const;
        fields.forEach((field) => {
            const error = ValidationRules.required(data[field], field);
            if (error) errors[field] = error;
        });

        // Date of Birth validation
        const dobRequired = ValidationRules.required(data.dateOfBirth, 'dateOfBirth');
        if (dobRequired) {
            errors.dateOfBirth = dobRequired;
        } else {
            const ageError = ValidationRules.age(data.dateOfBirth, 16);
            if (ageError) errors.dateOfBirth = ageError;
        }
    }

    private static validateAddress(
        address: ApplicationFormData['address'],
        errors: ValidationErrors
    ): void {
        const fields = ['street', 'city', 'state', 'zipCode'] as const;
        fields.forEach((field) => {
            const error = ValidationRules.required(address[field], field);
            if (error) {
                errors.address![field] = error;
            } else if (field === 'zipCode') {
                const zipError = ValidationRules.zipCode(address[field]);
                if (zipError) errors.address![field] = zipError;
            }
        });
    }

    private static validateVehicles(
        vehicles: ApplicationFormData['vehicles'],
        errors: ValidationErrors
    ): void {
        if (!vehicles.length) {
            errors.vehiclesError = 'At least one vehicle is required';
            return;
        }

        vehicles.forEach((vehicle, index) => {
            const vehicleErrors: Record<string, string> = {};

            // VIN validation
            const vinError = ValidationRules.required(vehicle.vin, 'VIN');
            if (vinError) vehicleErrors.vin = vinError;

            // Year validation
            const yearRequired = ValidationRules.required(vehicle.year, 'Year');
            if (yearRequired) {
                vehicleErrors.year = yearRequired;
            } else {
                const yearError = ValidationRules.vehicleYear(vehicle.year);
                if (yearError) vehicleErrors.year = yearError;
            }

            // Make validation
            const makeError = ValidationRules.required(vehicle.make, 'Make');
            if (makeError) vehicleErrors.make = makeError;

            // Model validation
            const modelError = ValidationRules.required(vehicle.model, 'Model');
            if (modelError) vehicleErrors.model = modelError;

            errors.vehicles![index] = vehicleErrors;
        });
    }

    private static validatePeople(
        people: ApplicationFormData['people'],
        errors: ValidationErrors
    ): void {
        if (!people.length) return;

        people.forEach((person, index) => {
            const personErrors: Record<string, string> = {};

            // Basic field validation
            const fields = ['firstName', 'lastName', 'relationship'] as const;
            fields.forEach((field) => {
                const error = ValidationRules.required(person[field], field);
                if (error) personErrors[field] = error;
            });

            // Date of Birth validation
            const dobRequired = ValidationRules.required(person.dateOfBirth, 'dateOfBirth');
            if (dobRequired) {
                personErrors.dateOfBirth = dobRequired;
            } else {
                const ageError = ValidationRules.age(person.dateOfBirth, 16);
                if (ageError) personErrors.dateOfBirth = ageError;
            }

            errors.people![index] = personErrors;
        });
    }

    static hasErrors(errors: ValidationErrors): boolean {
        if (typeof errors !== 'object') return false;

        return Object.keys(errors).some((key) => {
            const value = errors[key as keyof ValidationErrors];

            if (Array.isArray(value)) {
                return value.some((item) => Object.values(item).some((error) => !!error));
            }

            if (typeof value === 'object' && value !== null) {
                return Object.values(value).some((error) => !!error);
            }

            return !!value;
        });
    }
}
