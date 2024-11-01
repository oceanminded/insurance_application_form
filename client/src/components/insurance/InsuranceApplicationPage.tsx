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
import { ApplicationValidator } from './validators/ApplicationValidator';

export const InsuranceApplicationPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [validationErrors, setValidationErrors] = useState<Record<string, any>>({});
    const [showForm, setShowForm] = useState(true);

    const [createApplication, { isLoading: isCreating, error: createError }] =
        useCreateApplicationMutation();
    const [updateApplication, { isLoading: isUpdating, error: updateError }] =
        useUpdateApplicationMutation();
    const [getQuote, { data: quoteData, isLoading: isQuoting, error: quoteError }] =
        useGetQuoteMutation();
    const { data: application, isLoading: isLoadingApplication } = useGetApplicationQuery(
        id ?? 'skip',
        { skip: !id }
    );

    const defaultValues: ApplicationFormData = {
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
    };

    const { control, reset, getValues } = useForm<ApplicationFormData>({
        defaultValues,
    });

    const vehicleArray = useFieldArray({
        control,
        name: 'vehicles',
    });

    const peopleArray = useFieldArray({
        control,
        name: 'people',
    });

    useEffect(() => {
        setShowForm(!quoteData);
    }, [quoteData]);

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
        const { isValid, errors } = ApplicationValidator.validate(data);
        setValidationErrors(errors);
        return isValid;
    };

    const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = getValues();
        const formattedData = formatDatesInFormResponse(formData, DATE_FIELDS);
        let applicationId = id;

        try {
            if (!applicationId) {
                const result = await createApplication(formattedData).unwrap();
                applicationId = result?.application?.id;
                if (applicationId) {
                    navigate(`/applications/${applicationId}`, { replace: true });
                }
            } else {
                await updateApplication({ id: applicationId, data: formattedData }).unwrap();
            }

            const isValid = validateForm(formData);
            if (isValid && applicationId) {
                try {
                    await getQuote(applicationId).unwrap();
                } catch (quoteErr) {
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

                        <form
                            noValidate
                            onSubmit={(e) => e.preventDefault()}
                            style={{ width: '100%' }}
                        >
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
