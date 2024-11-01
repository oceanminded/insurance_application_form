export class ValidationRules {
    static required(value: any, fieldName: string): string | null {
        return !value ? `${fieldName} is required` : null;
    }

    static age(date: Date | null, minAge: number): string | null {
        if (!date) return null; // handled by required check
        const today = new Date();
        const birth = new Date(date);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age < minAge ? `Must be at least ${minAge} years old` : null;
    }

    static zipCode(value: string): string | null {
        return !/^\d{5}(-\d{4})?$/.test(value) ? 'Invalid ZIP code format' : null;
    }

    static vehicleYear(year: number): string | null {
        const currentYear = new Date().getFullYear();
        return year < 1985 || year > currentYear + 1
            ? 'Vehicle year must be between 1985 and next year'
            : null;
    }
}
