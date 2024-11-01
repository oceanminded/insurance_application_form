import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vehicle } from '../types/insuranceApplication.models';

interface InsuranceApplicationState {
    vehicles: Vehicle[];
    people: any[];
}

const initialState: InsuranceApplicationState = {
    vehicles: [],
    people: [],
};

const insuranceApplicationSlice = createSlice({
    name: 'insuranceApplication',
    initialState,
    reducers: {
        addVehicle: (state, action: PayloadAction<Vehicle>) => {
            state.vehicles.push(action.payload);
        },
        removeVehicle: (state, action: PayloadAction<string>) => {
            state.vehicles = state.vehicles.filter((vehicle) => vehicle.id !== action.payload);
        },
        addPerson: (state, action) => {
            state.people.push({
                ...action.payload,
                dateOfBirth: action.payload.dateOfBirth,
                relationship: action.payload.relationship,
            });
        },
        removePerson: (state, action) => {
            state.people = state.people.filter((person) => person.id !== action.payload);
        },
    },
    selectors: {
        selectInsuranceApplication: (state) => state,
        selectVehicles: (state) => state.vehicles,
        selectPeople: (state) => state.people,
    },
});

export const { addVehicle, removeVehicle, addPerson, removePerson } =
    insuranceApplicationSlice.actions;
export const { selectVehicles, selectPeople } = insuranceApplicationSlice.selectors;

export default insuranceApplicationSlice.reducer;
