import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Grid, TextField, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { FormGrid } from './StyledComponents';
import { ApplicationFormData } from './types';
import { US_STATES } from './constants';
import { isAtLeast16YearsOld } from './utils';

interface PersonalInfoSectionProps {
    control: Control<ApplicationFormData>;
    errors: any;
}

export const PersonalInfoSection = ({ control, errors }: PersonalInfoSectionProps) => (
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
                        helperText={errors.firstName}
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
                        helperText={errors.lastName}
                    />
                )}
            />
        </Grid>

        <Grid item xs={12} sm={6}>
            <Controller
                name="dateOfBirth"
                control={control}
                rules={{
                    required: 'Date of birth is required',
                    validate: {
                        ageCheck: (value) =>
                            isAtLeast16YearsOld(value) || 'Must be at least 16 years old',
                    },
                }}
                render={({ field }) => (
                    <DatePicker
                        {...field}
                        label="Date of Birth"
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!errors.dateOfBirth,
                                helperText: errors.dateOfBirth,
                            },
                        }}
                    />
                )}
            />
        </Grid>

        <Grid item xs={12}>
            <Controller
                name="address.street"
                control={control}
                rules={{ required: 'Street address is required' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Street Address"
                        fullWidth
                        error={!!errors.address?.street}
                        helperText={errors.address?.street}
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
                        helperText={errors.address?.city}
                    />
                )}
            />
        </Grid>

        <Grid item xs={12} sm={3}>
            <Controller
                name="address.state"
                control={control}
                rules={{ required: 'State is required' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        select
                        label="State"
                        fullWidth
                        error={!!errors.address?.state}
                        helperText={errors.address?.state}
                    >
                        {US_STATES.map((state) => (
                            <MenuItem key={state.value} value={state.value}>
                                {state.label}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
            />
        </Grid>

        <Grid item xs={12} sm={3}>
            <Controller
                name="address.zipCode"
                control={control}
                rules={{
                    required: 'ZIP code is required',
                    pattern: {
                        value: /^\d{5}(-\d{4})?$/,
                        message: 'Invalid ZIP code format',
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="ZIP Code"
                        fullWidth
                        error={!!errors.address?.zipCode}
                        helperText={errors.address?.zipCode}
                    />
                )}
            />
        </Grid>
    </FormGrid>
);
