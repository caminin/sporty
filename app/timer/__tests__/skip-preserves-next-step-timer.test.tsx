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

describe('Skip preserves next step timer', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        mockPush.mockClear();
        mockGet.mockClear();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('skip from work (45s) to rest (30s) → countdown displays 30', async () => {
        const steps: SessionStep[] = [
            { kind: 'work', name: 'Ex1', group: 'A', type: 'time', duration: 45 },
            { kind: 'rest', duration: 30 },
        ];
        mockGet.mockImplementation((key: string) => (key === 'session' ? createSession(steps) : null));

        render(<TimerPage />);

        // Wait for session to load, skip preparation
        await act(async () => {
            const skipBtn = await screen.findByRole('button', { name: /passer/i });
            skipBtn.click();
        });

        // Now on work 45s, click skip to go to rest 30s
        await act(async () => {
            const skipBtn = screen.getByRole('button', { name: /passer/i });
            skipBtn.click();
        });

        const display = screen.getByTestId('timer-display');
        expect(display).toHaveTextContent('30');
    });

    it('skip from rest (30s) to work (45s) → countdown displays 45', async () => {
        const steps: SessionStep[] = [
            { kind: 'work', name: 'Ex1', group: 'A', type: 'time', duration: 10 },
            { kind: 'rest', duration: 30 },
            { kind: 'work', name: 'Ex2', group: 'B', type: 'time', duration: 45 },
        ];
        mockGet.mockImplementation((key: string) => (key === 'session' ? createSession(steps) : null));

        render(<TimerPage />);

        // Skip preparation for first exercise
        await act(async () => {
            const skipBtn = await screen.findByRole('button', { name: /passer/i });
            skipBtn.click();
        });

        // Skip first work
        await act(async () => {
            const skipBtn = screen.getByRole('button', { name: /passer/i });
            skipBtn.click();
        });

        // Now on rest 30s, skip to second work 45s
        await act(async () => {
            const skipBtn = screen.getByRole('button', { name: /passer/i });
            skipBtn.click();
        });

        const display = screen.getByTestId('timer-display');
        expect(display).toHaveTextContent('45');
    });

    it('skip during preparation → next exercise starts with correct duration', async () => {
        const steps: SessionStep[] = [
            { kind: 'work', name: 'Ex1', group: 'A', type: 'time', duration: 45 },
            { kind: 'rest', duration: 30 },
        ];
        mockGet.mockImplementation((key: string) => (key === 'session' ? createSession(steps) : null));

        render(<TimerPage />);

        // Skip preparation (first exercise prep)
        await act(async () => {
            const skipBtn = await screen.findByRole('button', { name: /passer/i });
            skipBtn.click();
        });

        // Should now show work 45s
        const display = screen.getByTestId('timer-display');
        expect(display).toHaveTextContent('45');
    });
});
