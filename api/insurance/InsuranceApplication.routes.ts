import { Router, json } from 'express';
import { Application, PrismaClient } from '@prisma/client';
import { insuranceApplicationService } from './InsuranceApplication.service';

const prisma = new PrismaClient();

export const initializeRoutes = (router: Router) => {
    router.use(json());

    router.post('/', async (req, res) => {
        try {
            return res.json(await insuranceApplicationService.createApplication(req.body));
        } catch (error: any) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            return res.json(
                await insuranceApplicationService.getApplication({ id: req.params.id })
            );
        } catch (error: any) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            return res.json(
                await insuranceApplicationService.updateApplication({ id: req.params.id }, req.body)
            );
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });

    router.post('/:id/quote', async (req, res) => {
        try {
            const price = await insuranceApplicationService.generateQuote(req.params.id);
            return res.json({ price });
        } catch (error: any) {
            if (error.message.includes('Validation failed')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === 'Application not found') {
                return res.status(404).json({ error: error.message });
            }
            console.error('Quote generation error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });

    router.post('/:id/vehicles', async (req, res) => {
        try {
            const updatedApplication = await insuranceApplicationService.addVehicle(
                req.params.id,
                req.body
            );
            return res.json(updatedApplication);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    });

    router.post('/:id/people', async (req, res) => {
        try {
            const updatedApplication = await insuranceApplicationService.addPerson(
                req.params.id,
                req.body
            );
            return res.json(updatedApplication);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    });

    router.delete('/:id/vehicles/:vehicleId', async (req, res) => {
        try {
            const updatedApplication = await insuranceApplicationService.deleteVehicle(
                req.params.id,
                req.params.vehicleId
            );
            return res.json(updatedApplication);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    });

    router.delete('/:id/people/:personId', async (req, res) => {
        try {
            const updatedApplication = await insuranceApplicationService.deletePerson(
                req.params.id,
                req.params.personId
            );
            return res.json(updatedApplication);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    });
};
