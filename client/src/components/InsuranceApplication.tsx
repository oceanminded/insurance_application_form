import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
    Button,
    TextField,
    Grid,
    Paper,
    Typography,
    Alert,
    Container,
    MenuItem,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import {
    useCreateApplicationMutation,
    useGetApplicationQuery,
    useUpdateApplicationMutation,
} from '../services/apiSlice';
import { InsuranceApplication } from '../types/insuranceApplication.models';
import { parseISO } from 'date-fns';
import _ from 'lodash'; // Import lodash
import styled from '@emotion/styled';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Constant list of paths to date fields relative to data
const DATE_FIELDS = ['dateOfBirth', 'people[].dateOfBirth'];

type ApplicationFormData = {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
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
        dateOfBirth: Date;
    }[];
};

// Add this helper function at the top level
const isAtLeast16YearsOld = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 16;
    }
    return age >= 16;
};

// Styled components
const FormSection = styled(Paper)`
    padding: 2.5rem;
    margin-top: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled(Typography)`
    margin: 2rem 0 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    position: relative;
    &:after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 40px;
        height: 3px;
        background: #3498db;
        border-radius: 2px;
    }
`;

const StyledButton = styled(Button)`
    margin-top: 1rem;
    padding: 0.8rem 1.5rem;
    text-transform: none;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
`;

const ActionButton = styled(StyledButton)`
    margin: 1rem 0.5rem;
`;

const FormGrid = styled(Grid)`
    margin-top: 1rem;
`;

const SubSection = styled.div`
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    margin: 1rem 0;
    border: 1px solid #e2e8f0;
`;

export const InsuranceApplicationPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [createApplication, { isLoading: isCreating, error: createError }] =
        useCreateApplicationMutation();
    const { data: application, isLoading: isLoadingApplication } = useGetApplicationQuery(id!, {
        skip: !id,
    });
    const [updateApplication, { isLoading: isUpdating, error: updateError }] =
        useUpdateApplicationMutation();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ApplicationFormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            dateOfBirth: new Date(),
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

    const {
        fields: vehicleFields,
        append: appendVehicle,
        remove: removeVehicleField,
    } = useFieldArray({
        control,
        name: 'vehicles',
    });

    const {
        fields: personFields,
        append: appendPerson,
        remove: removePersonField,
    } = useFieldArray({
        control,
        name: 'people',
    });

    useEffect(() => {
        if (application) {
            reset({
                ...application,
                dateOfBirth: application?.dateOfBirth
                    ? parseISO(application?.dateOfBirth)
                    : undefined,
                vehicles: application.vehicles || [],
                people:
                    application.people.map((person) => ({
                        ...person,
                        dateOfBirth: person.dateOfBirth ? parseISO(person.dateOfBirth) : undefined,
                    })) || [],
            });
        }
    }, [application, reset]);

    const handleSaveApplication = async (data: ApplicationFormData) => {
        try {
            const formattedData = formatDatesInFormResponse(data, DATE_FIELDS);
            formattedData.vehicles = data.vehicles;
            formattedData.people = data.people;

            await updateApplication({ id: id!, data: formattedData }).unwrap();
            navigate(`/applications/${id}`);
        } catch (err) {
            console.error(err);
        }
    };

    const onSubmit = async (data: ApplicationFormData) => {
        try {
            if (id) {
                await handleSaveApplication(data);
            } else {
                const formattedData = formatDatesInFormResponse(data, DATE_FIELDS);
                const response = await createApplication(
                    formattedData as Partial<InsuranceApplication>
                ).unwrap();
                navigate(`/applications/${response.application.id}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoadingApplication) return <p>Loading application...</p>;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="md">
                <FormSection elevation={0}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{ fontWeight: 600, color: '#1a365d' }}
                    >
                        {id ? 'Update Insurance Application' : 'New Insurance Application'}
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormGrid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="firstName"
                                    control={control}
                                    rules={{ required: 'First name is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="First Name"
                                            fullWidth
                                            error={!!errors.firstName}
                                            helperText={errors.firstName?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="lastName"
                                    control={control}
                                    rules={{ required: 'Last name is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Last Name"
                                            fullWidth
                                            error={!!errors.lastName}
                                            helperText={errors.lastName?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="dateOfBirth"
                                    control={control}
                                    rules={{ required: 'Date of birth is required' }}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            label="Date of Birth"
                                            onChange={(date) => field.onChange(date)}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="address.street"
                                    control={control}
                                    rules={{ required: 'Street is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Street"
                                            fullWidth
                                            error={!!errors.address?.street}
                                            helperText={errors.address?.street?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="address.city"
                                    control={control}
                                    rules={{ required: 'City is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="City"
                                            fullWidth
                                            error={!!errors.address?.city}
                                            helperText={errors.address?.city?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="address.state"
                                    control={control}
                                    rules={{ required: 'State is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="State"
                                            fullWidth
                                            error={!!errors.address?.state}
                                            helperText={errors.address?.state?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="address.zipCode"
                                    control={control}
                                    rules={{
                                        required: 'Zip code is required',
                                        pattern: {
                                            value: /^\d{5}(-\d{4})?$/,
                                            message: 'Invalid zip code format',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Zip Code"
                                            fullWidth
                                            error={!!errors.address?.zipCode}
                                            helperText={errors.address?.zipCode?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </FormGrid>

                        <SectionTitle variant="h5">Vehicles</SectionTitle>
                        {vehicleFields.map((vehicle, index) => (
                            <SubSection key={vehicle.id}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name={`vehicles.${index}.vin`}
                                            control={control}
                                            rules={{
                                                required: 'VIN is required',
                                                pattern: {
                                                    value: /^[A-HJ-NPR-Z0-9]{17}$/i,
                                                    message: 'Invalid VIN format',
                                                },
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="VIN"
                                                    fullWidth
                                                    error={!!errors.vehicles?.[index]?.vin}
                                                    helperText={
                                                        errors.vehicles?.[index]?.vin?.message
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name={`vehicles.${index}.year`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Year"
                                                    type="number"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name={`vehicles.${index}.make`}
                                            control={control}
                                            rules={{ required: 'Make is required' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Make"
                                                    fullWidth
                                                    error={!!errors.vehicles?.[index]?.make}
                                                    helperText={
                                                        errors.vehicles?.[index]?.make?.message
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name={`vehicles.${index}.model`}
                                            control={control}
                                            rules={{ required: 'Model is required' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Model"
                                                    fullWidth
                                                    error={!!errors.vehicles?.[index]?.model}
                                                    helperText={
                                                        errors.vehicles?.[index]?.model?.message
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ActionButton
                                            type="button"
                                            variant="outlined"
                                            color="error"
                                            onClick={() => removeVehicleField(index)}
                                            startIcon={<DeleteIcon />}
                                        >
                                            Remove Vehicle
                                        </ActionButton>
                                    </Grid>
                                </Grid>
                            </SubSection>
                        ))}
                        <ActionButton
                            type="button"
                            variant="contained"
                            onClick={() =>
                                appendVehicle({
                                    vin: '',
                                    year: new Date().getFullYear(),
                                    make: '',
                                    model: '',
                                })
                            }
                            startIcon={<AddIcon />}
                        >
                            Add Vehicle
                        </ActionButton>

                        <SectionTitle variant="h5">People</SectionTitle>
                        {personFields.map((person, index) => (
                            <SubSection key={person.id}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name={`people.${index}.firstName`}
                                            control={control}
                                            rules={{ required: 'First name is required' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="First Name"
                                                    fullWidth
                                                    error={!!errors.people?.[index]?.firstName}
                                                    helperText={
                                                        errors.people?.[index]?.firstName?.message
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name={`people.${index}.lastName`}
                                            control={control}
                                            rules={{ required: 'Last name is required' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Last Name"
                                                    fullWidth
                                                    error={!!errors.people?.[index]?.lastName}
                                                    helperText={
                                                        errors.people?.[index]?.lastName?.message
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name={`people.${index}.relationship`}
                                            control={control}
                                            rules={{ required: 'Relationship is required' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Relationship"
                                                    select
                                                    fullWidth
                                                    error={!!errors.people?.[index]?.relationship}
                                                    helperText={
                                                        errors.people?.[index]?.relationship
                                                            ?.message
                                                    }
                                                >
                                                    <MenuItem value="Spouse">Spouse</MenuItem>
                                                    <MenuItem value="Sibling">Sibling</MenuItem>
                                                    <MenuItem value="Parent">Parent</MenuItem>
                                                    <MenuItem value="Friend">Friend</MenuItem>
                                                    <MenuItem value="Other">Other</MenuItem>
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name={`people.${index}.dateOfBirth`}
                                            control={control}
                                            rules={{
                                                required: 'Date of birth is required',
                                                validate: {
                                                    minimumAge: (date) =>
                                                        isAtLeast16YearsOld(date) ||
                                                        'Person must be at least 16 years old',
                                                },
                                            }}
                                            render={({ field }) => (
                                                <DatePicker
                                                    {...field}
                                                    label="Date of Birth"
                                                    onChange={(date) => {
                                                        if (date instanceof Date)
                                                            field.onChange(date);
                                                        else {
                                                            field.onChange(
                                                                date ? parseISO(date) : null
                                                            );
                                                        }
                                                    }}
                                                    slotProps={{
                                                        textField: {
                                                            error: !!errors.people?.[index]
                                                                ?.dateOfBirth,
                                                            helperText:
                                                                errors.people?.[index]?.dateOfBirth
                                                                    ?.message,
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ActionButton
                                            type="button"
                                            variant="outlined"
                                            color="error"
                                            onClick={() => removePersonField(index)}
                                            startIcon={<DeleteIcon />}
                                        >
                                            Remove Person
                                        </ActionButton>
                                    </Grid>
                                </Grid>
                            </SubSection>
                        ))}
                        <ActionButton
                            type="button"
                            variant="contained"
                            onClick={() =>
                                appendPerson({
                                    firstName: '',
                                    lastName: '',
                                    relationship: '',
                                    dateOfBirth: new Date(),
                                })
                            }
                            startIcon={<AddIcon />}
                        >
                            Add Person
                        </ActionButton>

                        <StyledButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isCreating || isUpdating}
                            fullWidth
                            sx={{ mt: 4 }}
                        >
                            {isCreating || isUpdating ? 'Processing...' : 'Save Application'}
                        </StyledButton>

                        {(createError || updateError) && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                Failed to {id ? 'update' : 'create'} application. Please try again.
                            </Alert>
                        )}
                    </form>
                </FormSection>
            </Container>
        </LocalizationProvider>
    );
};

// Helper function to format date of birth
function formatDateOfBirth(date: any) {
    if (date instanceof Date) {
        return date;
    } else if (typeof date === 'string') {
        return parseISO(date);
    }
    return undefined; // Return undefined for invalid formats
}

function formatDatesInFormResponse(data: any, paths: string[]) {
    const formattedData = { ...data };
    paths.forEach((path) => {
        const value = _.get(data, path);
        if (Array.isArray(value)) {
            const formattedArray = value
                .filter((item: any) => item && item.dateOfBirth)
                .map((item: any) => ({
                    ...item,
                    dateOfBirth: formatDateOfBirth(item.dateOfBirth),
                }));
            _.set(formattedData, path, formattedArray);
        } else {
            _.set(formattedData, path, formatDateOfBirth(value));
        }
    });
    return formattedData;
}
