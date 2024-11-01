import React from 'react';
import { Control, UseFieldArrayReturn, Controller } from 'react-hook-form';
import { Grid, TextField, Typography } from '@mui/material';
import { ApplicationFormData } from './types';
import { SubSection, ActionButton } from './StyledComponents';
import DeleteIcon from '@mui/icons-material/Delete';

interface VehicleSectionProps {
    control: Control<ApplicationFormData>;
    errors: any;
    vehicleArray: UseFieldArrayReturn<ApplicationFormData, 'vehicles'>;
}

export const VehicleSection = ({ control, errors, vehicleArray }: VehicleSectionProps) => {
    const { fields, remove, append } = vehicleArray;

    return (
        <>
            {fields.map((vehicle, index) => (
                <SubSection key={vehicle.id}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name={`vehicles.${index}.vin`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="VIN"
                                        fullWidth
                                        error={!!errors.vehicles?.[index]?.vin}
                                        helperText={errors.vehicles?.[index]?.vin || ''}
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
                                        type="number"
                                        label="Year"
                                        fullWidth
                                        onChange={(e) => {
                                            const value = e.target.value
                                                ? Number(e.target.value)
                                                : null;
                                            field.onChange(value);
                                        }}
                                        error={!!errors.vehicles?.[index]?.year}
                                        helperText={errors.vehicles?.[index]?.year || ''}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name={`vehicles.${index}.make`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Make"
                                        fullWidth
                                        error={!!errors.vehicles?.[index]?.make}
                                        helperText={errors.vehicles?.[index]?.make || ''}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name={`vehicles.${index}.model`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Model"
                                        fullWidth
                                        error={!!errors.vehicles?.[index]?.model}
                                        helperText={errors.vehicles?.[index]?.model || ''}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <ActionButton
                                onClick={() => remove(index)}
                                variant="outlined"
                                color="error"
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
                    append({
                        vin: '',
                        year: Number(new Date().getFullYear()),
                        make: '',
                        model: '',
                    })
                }
            >
                Add Vehicle
            </ActionButton>
            {errors.vehiclesError && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {errors.vehiclesError}
                </Typography>
            )}
        </>
    );
};
