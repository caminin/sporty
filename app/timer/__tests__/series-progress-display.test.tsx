/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { render, screen, act } from '@testing-library/react';
import TimerPage from '../page';
import { encodeSession } from '../../session-utils';
import type { SessionStep } from '../../exercises/types';

const mockPush = jest.fn();
const mockGet = jest.fn();
const stableSearchParams = { get: mockGet };

jest.mock('next/navigation', () => ({
    useSearchParams: () => stableSearchParams,
    useRouter: () => ({ push: mockPush }),
}));

function createSession(steps: SessionStep[]) {
    return encodeSession(steps);
}

describe('Timer series progress display', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        mockPush.mockClear();
        mockGet.mockClear();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('shows series badge on multi-series work step', async () => {
        const steps: SessionStep[] = [
            {
                kind: 'work',
                name: 'Pompes',
                group: 'Pecs',
                type: 'reps',
                reps: 40,
                seriesIndex: 1,
                seriesTotal: 3,
            },
            { kind: 'rest', duration: 20 },
            {
                kind: 'work',
                name: 'Pompes',
                group: 'Pecs',
                type: 'reps',
                reps: 40,
                seriesIndex: 2,
                seriesTotal: 3,
            },
        ];
        mockGet.mockImplementation((key: string) => (key === 'session' ? createSession(steps) : null));

        render(<TimerPage />);

        await act(async () => {
            const skipBtn = await screen.findByRole('button', { name: /passer/i });
            skipBtn.click();
        });

        expect(screen.getAllByTestId('series-progress-badge').length).toBeGreaterThan(0);
        expect(screen.getByText('Série 1/3')).toBeInTheDocument();
    });

    it('does not show series badge for single-series work step', async () => {
        const steps: SessionStep[] = [
            { kind: 'work', name: 'Squat', group: 'Jambes', type: 'time', duration: 45 },
        ];
        mockGet.mockImplementation((key: string) => (key === 'session' ? createSession(steps) : null));

        render(<TimerPage />);

        await act(async () => {
            const skipBtn = await screen.findByRole('button', { name: /passer/i });
            skipBtn.click();
        });

        expect(screen.queryByTestId('series-progress-badge')).not.toBeInTheDocument();
    });

    it('shows series on preparation screen for first multi-series exercise', async () => {
        const steps: SessionStep[] = [
            {
                kind: 'work',
                name: 'Pompes',
                group: 'Pecs',
                type: 'reps',
                reps: 40,
                seriesIndex: 1,
                seriesTotal: 3,
            },
        ];
        mockGet.mockImplementation((key: string) => (key === 'session' ? createSession(steps) : null));

        render(<TimerPage />);

        await act(async () => {
            await screen.findByText('Préparez-vous !');
        });

        expect(screen.getByText('Série 1/3')).toBeInTheDocument();
    });
});
