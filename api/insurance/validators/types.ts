export type ValidationResult = {
    isValid: boolean;
    errors: ValidationError[];
};

export type ValidationError = {
    field: string;
    message: string;
};

export type Validator<T> = {
    validate: (value: T) => ValidationError[];
};

export type ValidationRule<T> = {
    test: (value: T) => boolean;
    message: string;
};
