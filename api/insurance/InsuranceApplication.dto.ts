import {
    Address,
    CreateInsuranceApplicationRequest,
    InsuranceApplication,
    Person,
    UpdateInsuranceApplicationRequest,
    Vehicle,
} from './InsuranceApplication.models';
import { Application, Prisma } from '@prisma/client';

export class InsuranceApplicationDto {
    constructor(
        public id?: string | null,
        public firstName?: string | null,
        public lastName?: string | null,
        public dateOfBirth?: Date | null,
        public address?: Address | null,
        public vehicles?: Vehicle[] | null,
        public people?: Person[] | null
    ) {}

    static fromCreateInsuranceApplicationRequest(
        request: CreateInsuranceApplicationRequest
    ): InsuranceApplicationDto {
        return new InsuranceApplicationDto(
            undefined,
            request.firstName,
            request.lastName,
            request.dateOfBirth,
            request.address,
            request.vehicles,
            request.people
        );
    }

    static fromDb(
        application: Application & {
            vehicles: any[];
            people: any[];
        }
    ): InsuranceApplicationDto {
        return new InsuranceApplicationDto(
            application.id.toString(),
            application.firstName,
            application.lastName,
            application.dateOfBirth,
            {
                street: application.street,
                city: application.city,
                state: application.state,
                zipCode: application.zipCode,
            },
            application.vehicles.map((v) => ({
                id: v.id.toString(),
                vin: v.vin,
                year: v.year,
                make: v.make,
                model: v.model,
            })),
            application.people.map((p) => ({
                id: p.id.toString(),
                firstName: p.firstName,
                lastName: p.lastName,
                dateOfBirth: p.dateOfBirth,
                relationship: p.relationship,
            }))
        );
    }

    static fromUpdateInsuranceApplicationRequest(
        application: UpdateInsuranceApplicationRequest
    ): InsuranceApplicationDto {
        return new InsuranceApplicationDto(
            application.id,
            application.firstName,
            application.lastName,
            application.dateOfBirth,
            application.address,
            application.vehicles,
            application.people
        );
    }

    forSaveNew(): Prisma.ApplicationCreateInput {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            dateOfBirth: this.dateOfBirth,
            street: this.address?.street,
            city: this.address?.city,
            state: this.address?.state,
            zipCode: this.address?.zipCode,
            vehicles: {
                create: this.vehicles || [],
            },
            people: {
                create: this.people || [],
            },
        };
    }

    forUpdate(): Prisma.ApplicationUpdateInput {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            dateOfBirth: this.dateOfBirth,
            street: this.address?.street,
            city: this.address?.city,
            state: this.address?.state,
            zipCode: this.address?.zipCode,
            vehicles: {
                deleteMany: {},
                create: this.vehicles || [],
            },
            people: {
                deleteMany: {},
                create: this.people || [],
            },
        };
    }

    forDb() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            dateOfBirth: this.dateOfBirth,
            street: this.address?.street,
            city: this.address?.city,
            state: this.address?.state,
            zipCode: this.address?.zipCode,
            vehicles:
                this.vehicles?.map((v) => ({
                    vin: v.vin,
                    year: v.year,
                    make: v.make,
                    model: v.model,
                })) || [],
            people:
                this.people?.map((p) => ({
                    firstName: p.firstName,
                    lastName: p.lastName,
                    dateOfBirth: p.dateOfBirth,
                    relationship: p.relationship,
                })) || [],
        };
    }

    forAPI(): InsuranceApplication {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            dateOfBirth: this.dateOfBirth,
            address: {
                street: this.address?.street || null,
                city: this.address?.city || null,
                state: this.address?.state || null,
                zipCode: this.address?.zipCode || null,
            },
            vehicles:
                this.vehicles?.map((v) => ({
                    id: v.id,
                    vin: v.vin,
                    year: v.year,
                    make: v.make,
                    model: v.model,
                })) || [],
            people:
                this.people?.map((p) => ({
                    id: p.id,
                    firstName: p.firstName,
                    lastName: p.lastName,
                    dateOfBirth: p.dateOfBirth,
                    relationship: p.relationship,
                })) || [],
        };
    }
}
