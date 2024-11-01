import { InsuranceApplicationDto } from './InsuranceApplication.dto';
import {
    CreateApplicationResponse,
    CreateInsuranceApplicationRequest,
    InsuranceApplication,
    QuoteFactors,
    UpdateInsuranceApplicationRequest,
    Vehicle,
} from './InsuranceApplication.models';
import { PrismaClient, Application as DbInsuranceApplication } from '@prisma/client';
import { ValidationResult } from './validators/types';
import { applicationValidator } from './validators/validators';

class InsuranceApplicationService {
    private prisma: PrismaClient = new PrismaClient();

    constructor() {}

    async createApplication(
        createInsuranceApplicationRequest: CreateInsuranceApplicationRequest
    ): Promise<CreateApplicationResponse> {
        // insuranceApplicationService.validateApplication(insuranceApplication);
        const insuranceApplicationDto =
            InsuranceApplicationDto.fromCreateInsuranceApplicationRequest(
                createInsuranceApplicationRequest
            );

        const savedInsuranceApplicationDto =
            await this.saveNewInsuranceApplication(insuranceApplicationDto);

        return {
            application: savedInsuranceApplicationDto.forAPI(),
            resumeUrl: `${process.env.INSURANCE_APPLICATION_APP_URL}/applications/${savedInsuranceApplicationDto.id}`,
        };
    }

    async getApplication({ id }: { id: string }) {
        const dbApplication = await this.prisma.application.findUnique({
            where: { id: parseInt(id) },
            include: {
                vehicles: true,
                people: true,
            },
        });

        if (!dbApplication) {
            throw new Error('Application not found');
        }

        return InsuranceApplicationDto.fromDb(dbApplication).forAPI();
    }

    async updateApplication(
        { id }: { id: string },
        application: UpdateInsuranceApplicationRequest
    ) {
        const dbApplication = await this.prisma.application.findUnique({
            where: { id: parseInt(id) },
            include: {
                vehicles: true,
                people: true,
            },
        });

        if (!dbApplication) {
            throw new Error('Application not found');
        }

        // Convert to DTO
        const applicationDto =
            InsuranceApplicationDto.fromUpdateInsuranceApplicationRequest(application);
        const dbData = applicationDto.forDb();

        // Update application
        const updatedApplication = await this.prisma.application.update({
            where: { id: parseInt(id) },
            data: {
                firstName: dbData.firstName,
                lastName: dbData.lastName,
                dateOfBirth: dbData.dateOfBirth,
                street: dbData.street,
                city: dbData.city,
                state: dbData.state,
                zipCode: dbData.zipCode,
                vehicles: {
                    deleteMany: {},
                    create: dbData.vehicles,
                },
                people: {
                    deleteMany: {},
                    create: dbData.people,
                },
            },
            include: {
                vehicles: true,
                people: true,
            },
        });

        // Convert back to API format
        return InsuranceApplicationDto.fromDb(updatedApplication).forAPI();
    }

    async saveNewInsuranceApplication(
        insuranceApplicationDto: InsuranceApplicationDto
    ): Promise<InsuranceApplicationDto> {
        const application = await this.prisma.application.create({
            data: insuranceApplicationDto.forSaveNew(),
            include: {
                vehicles: true,
                people: true,
            },
        });

        return InsuranceApplicationDto.fromDb(application);
    }

    async updateInsuranceApplication(
        id: number,
        insuranceApplicationDto: InsuranceApplicationDto
    ): Promise<InsuranceApplicationDto> {
        const application = await this.prisma.application.update({
            where: { id },
            data: insuranceApplicationDto.forUpdate(),
            include: {
                vehicles: true,
                people: true,
            },
        });

        return InsuranceApplicationDto.fromDb(application);
    }

    validateApplication(application: InsuranceApplication): void {
        const result = applicationValidator.validate(application);
        if (result.length > 0) {
            throw new Error(
                'Validation failed: ' +
                    result.map((error) => `${error.field}: ${error.message}`).join('; ')
            );
        }
    }

    async generateQuote(applicationId: string): Promise<number> {
        const dbApplication = await this.prisma.application.findUnique({
            where: { id: parseInt(applicationId) },
            include: {
                vehicles: true,
                people: true,
            },
        });

        if (!dbApplication) {
            throw new Error('Application not found');
        }

        // Use DTO to transform and validate
        const applicationDto = InsuranceApplicationDto.fromDb(dbApplication);
        const application = applicationDto.forAPI();

        // Validate the application
        this.validateApplication(application);

        // Calculate quote
        const basePrice = 1000;
        const vehicleMultiplier = (application.vehicles?.length || 0) * 500;
        const peopleMultiplier = (application.people?.length || 0) * 250;

        return basePrice + vehicleMultiplier + peopleMultiplier;
    }

    async addVehicle(applicationId: string, vehicleData: any) {
        const updatedApplication = await this.prisma.application.update({
            where: { id: parseInt(applicationId) },
            data: {
                vehicles: {
                    create: vehicleData,
                },
            },
            include: {
                vehicles: true,
                people: true,
            },
        });
        return InsuranceApplicationDto.fromDb(updatedApplication).forAPI();
    }

    async addPerson(applicationId: string, personData: any) {
        const updatedApplication = await this.prisma.application.update({
            where: { id: parseInt(applicationId) },
            data: {
                people: {
                    create: personData,
                },
            },
            include: {
                vehicles: true,
                people: true,
            },
        });
        return InsuranceApplicationDto.fromDb(updatedApplication).forAPI();
    }

    async deleteVehicle(applicationId: string, vehicleId: string) {
        const updatedApplication = await this.prisma.application.update({
            where: { id: parseInt(applicationId) },
            data: {
                vehicles: {
                    delete: { id: parseInt(vehicleId) },
                },
            },
            include: {
                vehicles: true,
                people: true,
            },
        });
        return InsuranceApplicationDto.fromDb(updatedApplication).forAPI();
    }

    async deletePerson(applicationId: string, personId: string) {
        const updatedApplication = await this.prisma.application.update({
            where: { id: parseInt(applicationId) },
            data: {
                people: {
                    delete: { id: parseInt(personId) },
                },
            },
            include: {
                vehicles: true,
                people: true,
            },
        });
        return InsuranceApplicationDto.fromDb(updatedApplication).forAPI();
    }
}

export const insuranceApplicationService = new InsuranceApplicationService();
