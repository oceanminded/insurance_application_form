import { ApplicationFormData } from '../types';

export type ValidationResult = {
    isValid: boolean;
    errors: ValidationErrors;
};

export type ValidationErrors = {
    [K in keyof ApplicationFormData]?: any;
} & {
    address?: {
        [key: string]: string;
    };
    vehicles?: Array<{
        [key: string]: string;
    }>;
    people?: Array<{
        [key: string]: string;
    }>;
    vehiclesError?: string;
};
