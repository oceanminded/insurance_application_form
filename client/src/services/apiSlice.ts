import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { InsuranceApplication } from '../types/insuranceApplication.models';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
    tagTypes: ['Application'],
    endpoints: (builder) => ({
        createApplication: builder.mutation<
            { application: Partial<InsuranceApplication>; resumeUrl: string },
            Partial<InsuranceApplication>
        >({
            query: (data) => ({
                url: '/applications',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Application'],
        }),

        getApplication: builder.query<InsuranceApplication, string>({
            query: (id) => `/applications/${id}`,
            providesTags: ['Application'],
        }),

        updateApplication: builder.mutation<
            InsuranceApplication,
            { id: string; data: Partial<InsuranceApplication> }
        >({
            query: ({ id, data }) => ({
                url: `/applications/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Application'],
        }),

        getQuote: builder.mutation<any, string>({
            query: (id) => ({
                url: `/applications/${id}/quote`,
                method: 'POST',
            }),
        }),

        addVehicle: builder.mutation<InsuranceApplication, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/applications/${id}/vehicles`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Application'],
        }),

        addPerson: builder.mutation<InsuranceApplication, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/applications/${id}/people`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Application'],
        }),

        deleteVehicle: builder.mutation<InsuranceApplication, { id: string; vehicleId: string }>({
            query: ({ id, vehicleId }) => ({
                url: `/applications/${id}/vehicles/${vehicleId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Application'],
        }),

        deletePerson: builder.mutation<InsuranceApplication, { id: string; personId: string }>({
            query: ({ id, personId }) => ({
                url: `/applications/${id}/people/${personId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Application'],
        }),

        submitInsuranceApplication: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/applications/${id}/submit`,
                method: 'POST',
            }),
            invalidatesTags: ['Application'],
        }),
    }),
});

export const {
    useCreateApplicationMutation,
    useGetApplicationQuery,
    useUpdateApplicationMutation,
    useGetQuoteMutation,
    useAddVehicleMutation,
    useAddPersonMutation,
    useDeleteVehicleMutation,
    useDeletePersonMutation,
    useSubmitInsuranceApplicationMutation,
} = apiSlice;
