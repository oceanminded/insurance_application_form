import React from 'react';
import { Control, UseFieldArrayReturn, ControllerRenderProps, Controller } from 'react-hook-form';
import { Grid, TextField, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ApplicationFormData } from './types';
import { SubSection, ActionButton } from './StyledComponents';
import DeleteIcon from '@mui/icons-material/Delete';
import { isAtLeast16YearsOld } from './utils';

interface PeopleSectionProps {
    control: Control<ApplicationFormData>;
    errors: any;
    peopleArray: UseFieldArrayReturn<ApplicationFormData, 'people'>;
}

const RELATIONSHIPS = ['Spouse', 'Child', 'Parent', 'Sibling', 'Other'];

export const PeopleSection = ({ control, errors, peopleArray }: PeopleSectionProps) => {
    const { fields, remove, append } = peopleArray;

    return (
        <>
            {fields.map((person, index) => (
                <SubSection key={person.id}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={5}>
                            <Controller
                                name={`people.${index}.firstName`}
                                control={control}
                                rules={{ required: 'First name is required' }}
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<
                                        ApplicationFormData,
                                        `people.${number}.firstName`
                                    >;
                                }) => (
                                    <TextField
                                        {...field}
                                        label="First Name"
                                        fullWidth
                                        error={!!errors.people?.[index]?.firstName}
                                        helperText={errors.people?.[index]?.firstName || ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Controller
                                name={`people.${index}.lastName`}
                                control={control}
                                rules={{ required: 'Last name is required' }}
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<
                                        ApplicationFormData,
                                        `people.${number}.lastName`
                                    >;
                                }) => (
                                    <TextField
                                        {...field}
                                        label="Last Name"
                                        fullWidth
                                        error={!!errors.people?.[index]?.lastName}
                                        helperText={errors.people?.[index]?.lastName || ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Controller
                                name={`people.${index}.relationship`}
                                control={control}
                                rules={{ required: 'Relationship is required' }}
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<
                                        ApplicationFormData,
                                        `people.${number}.relationship`
                                    >;
                                }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Relationship"
                                        fullWidth
                                        error={!!errors.people?.[index]?.relationship}
                                        helperText={errors.people?.[index]?.relationship || ''}
                                    >
                                        {RELATIONSHIPS.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Controller
                                name={`people.${index}.dateOfBirth`}
                                control={control}
                                rules={{
                                    required: 'Date of birth is required',
                                    validate: {
                                        ageCheck: (value) =>
                                            isAtLeast16YearsOld(value) ||
                                            'Must be at least 16 years old',
                                    },
                                }}
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<
                                        ApplicationFormData,
                                        `people.${number}.dateOfBirth`
                                    >;
                                }) => (
                                    <DatePicker
                                        {...field}
                                        label="Date of Birth"
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.people?.[index]?.dateOfBirth,
                                                helperText:
                                                    errors.people?.[index]?.dateOfBirth || '',
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <ActionButton
                                onClick={() => remove(index)}
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                            >
                                Remove
                            </ActionButton>
                        </Grid>
                    </Grid>
                </SubSection>
            ))}
            <ActionButton
                type="button"
                variant="contained"
                onClick={() =>
                    append({
                        firstName: '',
                        lastName: '',
                        relationship: '',
                        dateOfBirth: null,
                    })
                }
            >
                Add Person
            </ActionButton>
        </>
    );
};
