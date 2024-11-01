import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Alert, Container, Typography, Grid, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parseISO } from 'date-fns';
import { CheckCircle, Edit } from '@mui/icons-material';

import { PersonalInfoSection } from './PersonalInfoSection';
import { VehicleSection } from './VehicleSection';
import { PeopleSection } from './PeopleSection';
import {
    FormSection,
    StyledButton,
    SectionTitle,
    QuoteCard,
    QuoteAmount,
    QuoteActions,
    QuoteMessage,
} from './StyledComponents';
import { formatDatesInFormResponse } from './utils';
import { DATE_FIELDS } from './constants';
import { ApplicationFormData } from './types';
import {
    useCreateApplicationMutation,
    useGetApplicationQuery,
    useUpdateApplicationMutation,
    useGetQuoteMutation,
} from '../../services/apiSlice';

export const InsuranceApplicationPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [validationErrors, setValidationErrors] = useState<Record<string, any>>({});
    const [showForm, setShowForm] = useState(true);

    // API Hooks
    const [createApplication, { isLoading: isCreating, error: createError }] =
        useCreateApplicationMutation();
    const { data: application, isLoading: isLoadingApplication } = useGetApplicationQuery(
        id ?? 'skip',
        {
            skip: !id,
        }
    );
    const [updateApplication, { isLoading: isUpdating, error: updateError }] =
        useUpdateApplicationMutation();
    const [getQuote, { data: quoteData, isLoading: isQuoting, error: quoteError }] =
        useGetQuoteMutation();

    // Update initial showForm state when quote data changes
    useEffect(() => {
        setShowForm(!quoteData);
    }, [quoteData]);

    // Form Setup - keep react-hook-form for field management and final submission
    const { control, handleSubmit, reset, getValues, register } = useForm<ApplicationFormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            dateOfBirth: null,
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
            },
            vehicles: [],
            people: [],
        },
    });

    // Field Arrays - keep these for managing dynamic fields
    const vehicleArray = useFieldArray({
        control,
        name: 'vehicles',
    });

    const peopleArray = useFieldArray({
        control,
        name: 'people',
    });

    // Load existing application data
    useEffect(() => {
        if (application) {
            const formattedData = {
                ...application,
                dateOfBirth: application.dateOfBirth ? parseISO(application.dateOfBirth) : null,
                people:
                    application.people?.map((person) => ({
                        ...person,
                        dateOfBirth: person.dateOfBirth ? parseISO(person.dateOfBirth) : null,
                    })) || [],
            };
            reset(formattedData);
        }
    }, [application, reset]);

    const validateForm = (data: ApplicationFormData) => {
        const errors: Record<string, any> = {
            address: {},
            vehicles: [],
            people: [],
        };

        // Helper function to check age
        const validateAge = (birthDate: Date | null): string | null => {
            if (!birthDate) return 'Date of birth is required';
            const today = new Date();
            const birth = new Date(birthDate);
            let calculatedAge = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                calculatedAge--;
            }

            return calculatedAge < 16 ? 'Must be at least 16 years old' : null;
        };

        // Personal Info Validation
        if (!data.firstName) errors.firstName = 'First name is required';
        if (!data.lastName) errors.lastName = 'Last name is required';
        if (!data.dateOfBirth) {
            errors.dateOfBirth = 'Date of birth is required';
        } else {
            const ageError = validateAge(data.dateOfBirth);
            if (ageError) errors.dateOfBirth = ageError;
        }

        // Address Validation
        if (!data.address.street) errors.address.street = 'Street address is required';
        if (!data.address.city) errors.address.city = 'City is required';
        if (!data.address.state) errors.address.state = 'State is required';
        if (!data.address.zipCode) errors.address.zipCode = 'ZIP code is required';
        else if (!/^\d{5}(-\d{4})?$/.test(data.address.zipCode)) {
            errors.address.zipCode = 'Invalid ZIP code format';
        }

        // Vehicle Validation - only show error message in one place
        if (!data.vehicles.length) {
            errors.vehiclesError = 'At least one vehicle is required';
        } else {
            data.vehicles.forEach((vehicle, index) => {
                errors.vehicles[index] = {
                    vin: !vehicle.vin ? 'VIN is required' : '',
                    year: !vehicle.year
                        ? 'Year is required'
                        : vehicle.year < 1985 || vehicle.year > new Date().getFullYear() + 1
                          ? 'Vehicle year must be between 1985 and next year'
                          : '',
                    make: !vehicle.make ? 'Make is required' : '',
                    model: !vehicle.model ? 'Model is required' : '',
                };
            });
        }

        // People Validation
        if (data.people.length > 0) {
            data.people.forEach((person, index) => {
                errors.people[index] = {};
                if (!person.firstName) errors.people[index].firstName = 'First name is required';
                if (!person.lastName) errors.people[index].lastName = 'Last name is required';
                if (!person.relationship)
                    errors.people[index].relationship = 'Relationship is required';

                // Add age validation for additional people
                const ageError = validateAge(person.dateOfBirth);
                if (ageError) errors.people[index].dateOfBirth = ageError;
            });
        }

        setValidationErrors(errors);
        return !hasErrors(errors);
    };

    // Helper to check if there are any errors
    const hasErrors = (errors: Record<string, any>): boolean => {
        if (typeof errors !== 'object') return false;
        return Object.keys(errors).some((key) => {
            const value = errors[key];
            if (Array.isArray(value)) {
                return value.some((item) => hasErrors(item));
            }
            if (typeof value === 'object') {
                return hasErrors(value);
            }
            return !!value;
        });
    };

    // Handle button click
    const handleButtonClick = async () => {
        const formData = getValues(); // Get current form values

        // Always validate and show feedback
        const isValid = validateForm(formData);

        try {
            const formattedData = formatDatesInFormResponse(formData, DATE_FIELDS);
            let applicationId = id;

            if (!id) {
                const result = await createApplication(formattedData).unwrap();
                if (result?.application?.id) {
                    applicationId = result.application.id;
                    navigate(`/applications/${applicationId}`, { replace: true });
                }
            } else {
                await updateApplication({ id, data: formattedData }).unwrap();
            }

            // Only try for quote if validation passed
            if (isValid && applicationId) {
                try {
                    await getQuote(applicationId).unwrap();
                } catch (quoteErr) {
                    // Quote validation failed - that's okay, we just show the validation errors
                    console.log('Quote validation failed:', quoteErr);
                }
            }
        } catch (err) {
            console.error('Error in form submission:', err);
        }
    };

    if (isLoadingApplication) {
        return <Container maxWidth="md">Loading application...</Container>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="md">
                {quoteData && !showForm ? (
                    <QuoteCard elevation={0}>
                        <CheckCircle
                            sx={{
                                fontSize: 56,
                                color: '#22c55e',
                                marginBottom: 2,
                            }}
                        />
                        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a365d' }}>
                            Your Quote is Ready!
                        </Typography>
                        <QuoteMessage>
                            Based on the information you provided, here's your estimated monthly
                            premium:
                        </QuoteMessage>
                        <QuoteAmount>
                            ${quoteData.price.toFixed(2)}
                            <span>/month</span>
                        </QuoteAmount>
                        <QuoteMessage>
                            Want to make changes? Click below to update your application.
                        </QuoteMessage>
                        <QuoteActions>
                            <StyledButton
                                variant="outlined"
                                onClick={() => setShowForm(true)}
                                startIcon={<Edit />}
                            >
                                Update Application
                            </StyledButton>
                            <StyledButton
                                variant="contained"
                                onClick={() => {
                                    /* Handle purchase flow */
                                }}
                            >
                                Purchase Now
                            </StyledButton>
                        </QuoteActions>
                    </QuoteCard>
                ) : (
                    <FormSection elevation={0}>
                        <Typography variant="h4" gutterBottom>
                            {id ? 'Update Insurance Application' : 'New Insurance Application'}
                        </Typography>

                        <form noValidate style={{ width: '100%' }}>
                            <PersonalInfoSection control={control} errors={validationErrors} />

                            <SectionTitle variant="h5">Vehicles</SectionTitle>
                            <VehicleSection
                                control={control}
                                errors={validationErrors}
                                vehicleArray={vehicleArray}
                            />

                            <SectionTitle variant="h5">Additional People</SectionTitle>
                            <PeopleSection
                                control={control}
                                errors={validationErrors}
                                peopleArray={peopleArray}
                            />

                            <StyledButton
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isCreating || isUpdating}
                                fullWidth
                                sx={{ mt: 4 }}
                                onClick={handleButtonClick}
                            >
                                {isCreating || isUpdating ? 'Processing...' : 'Get Quote'}
                            </StyledButton>

                            {(createError || updateError) && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {((createError || updateError) as any)?.data?.error ||
                                        'Failed to save application. Please try again.'}
                                </Alert>
                            )}
                        </form>
                    </FormSection>
                )}
            </Container>
        </LocalizationProvider>
    );
};
