import styled from '@emotion/styled';
import { Paper, Typography, Button, Grid } from '@mui/material';

export const FormSection = styled(Paper)`
    padding: 2.5rem;
    margin: 1rem auto;
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    max-width: 800px;
    border: 1px solid #f0f0f0;
`;

export const SubSection = styled(Paper)`
    padding: 1.5rem;
    margin: 1.5rem 0;
    border-radius: 16px;
    background: #fafafa;
    border: 1px solid #f0f0f0;
    box-shadow: none;
`;

export const SectionTitle = styled(Typography)`
    font-size: 1.3rem;
    font-weight: 500;
    margin: 2rem 0 1.5rem;
    color: #1d1d1f;
    letter-spacing: -0.02em;
`;

export const ActionButton = styled(Button)`
    margin: 0.75rem 0;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    text-transform: none;
    font-weight: 500;
    font-size: 0.9rem;
    color: #0066cc;
    background: transparent;

    &:hover {
        background: rgba(0, 102, 204, 0.1);
    }
`;

export const FormGrid = styled(Grid)`
    margin-top: 1rem;
    gap: 1rem;
`;

export const StyledButton = styled(Button)`
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    font-size: 1rem;
    text-transform: none;
    border-radius: 10px;
    background: #0066cc;
    color: white;
    box-shadow: none;
    transition: all 0.2s ease;

    &:hover {
        background: #0077ed;
        box-shadow: none;
    }

    &:active {
        background: #0055b3;
    }

    &:disabled {
        background: #f5f5f7;
        color: #86868b;
    }
`;

export const QuoteCard = styled(Paper)`
    padding: 2.5rem;
    margin: 2rem auto;
    border-radius: 16px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
    max-width: 640px;
    text-align: center;
    position: relative;
    border: 1px solid rgba(0, 102, 204, 0.1);
    box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.02),
        0 12px 28px rgba(0, 0, 0, 0.08);
`;

export const QuoteAmount = styled.div`
    font-size: 3.5rem;
    font-weight: 700;
    color: #0066cc;
    margin: 1.5rem 0;
    letter-spacing: -0.02em;

    span {
        font-size: 1.5rem;
        opacity: 0.7;
    }
`;

export const QuoteActions = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
`;

export const QuoteMessage = styled(Typography)`
    color: #4b5563;
    font-size: 1.1rem;
    margin: 1rem 0;
`;
