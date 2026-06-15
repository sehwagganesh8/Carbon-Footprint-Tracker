import React from 'react';
import { expect, describe, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardOverview from '../components/DashboardOverview';
import OnboardingCalculator from '../components/OnboardingCalculator';
import HabitTracker from '../components/HabitTracker';
import { CalculatedResults } from '../types';

describe('Dashboard Component Suite', () => {
  const mockBaseline: CalculatedResults = {
    transport: 250,
    diet: 150,
    energy: 200,
    total: 600,
    answers: {
      transportType: 'petrol',
      distance: 1000,
      dietType: 'moderate_meat',
      electricity: 300,
      heatingType: 'gas',
    },
  };

  describe('DashboardOverview', () => {
    it('renders emission breakdown correctly', () => {
      render(<DashboardOverview baseline={mockBaseline} savedCo2={0} />);
      expect(screen.getByText('Emission Metrics')).toBeInTheDocument();
      expect(screen.getByText('Emission Breakdown')).toBeInTheDocument();
      expect(screen.getByText('Initial Baseline')).toBeInTheDocument();
      expect(screen.getAllByText(/600/)[0]).toBeInTheDocument(); // Expect at least one '600'
      expect(screen.getByText('Mobility')).toBeInTheDocument();
      expect(screen.getByText('250 kg')).toBeInTheDocument();
    });

    it('calculates current emissions accounting for active savings', () => {
      render(<DashboardOverview baseline={mockBaseline} savedCo2={45} />);
      expect(screen.getByText('-45')).toBeInTheDocument();
      expect(screen.getByText(/555/)).toBeInTheDocument();
      expect(screen.getByText(/Reduced footprint by 8%/)).toBeInTheDocument();
    });

    it('handles edge case where savedCo2 exceeds total footprint gracefully', () => {
      render(<DashboardOverview baseline={mockBaseline} savedCo2={1000} />);
      // 0 represents Net Real Footprint
      expect(screen.getByText('Net Real Footprint').nextElementSibling?.textContent).toContain('0');
      expect(screen.getByText('Sustainable-Leader')).toBeInTheDocument();
    });
  });

  describe('Calculator Wizard (OnboardingCalculator)', () => {
    it('simulates user interaction - clicking Next Step through the wizard', async () => {
      const mockOnComplete = vi.fn();
      render(<OnboardingCalculator onComplete={mockOnComplete} />);

      // Step 1: Mobility
      expect(screen.getByText(/Select Commute Vehicle/i)).toBeInTheDocument();
      const nextBtn = screen.getByRole('button', { name: /Next Step/i });
      fireEvent.click(nextBtn);

      // Step 2: Dietary Choices (requires a tiny wait for motion/framer animations in real life, but testing-library usually finds it fast)
      await waitFor(() => {
        expect(screen.getByText(/Define Dietary Preference/i)).toBeInTheDocument();
      });
      fireEvent.click(nextBtn);

      // Step 3: Household Energy
      await waitFor(() => {
        expect(screen.getByText(/Household Power & Thermal Heating/i)).toBeInTheDocument();
      });

      // Confirm button changes text
      const finishBtn = screen.getByRole('button', { name: /Let's Carbon Audit!/i });
      fireEvent.click(finishBtn);

      // Verify onComplete was called with our answers (default inputs)
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledTimes(1);
        expect(mockOnComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            answers: expect.any(Object),
            total: expect.any(Number)
          })
        );
      });
    });
  });

  describe('HabitTracker interactions', () => {
    it('checking off a habit tracker task correctly fires toggle event', () => {
      const mockToggle = vi.fn();
      const mockRemove = vi.fn();
      const mockAdd = vi.fn();

      const sampleHabits = [
        { id: 'habit_1', title: 'Test Habit', category: 'Diet' as const, co2Savings: 5, points: 10, completedToday: false, frequency: 'daily' as const }
      ];

      render(
        <HabitTracker 
          completedTodayList={[]}
          onToggleHabit={mockToggle}
          customAndStaticHabits={sampleHabits}
          onAddCustomHabit={mockAdd}
          onRemoveCustomHabit={mockRemove}
          greenPoints={0}
        />
      );

      // Find the first habit's check button by id
      const dietHabitButton = document.getElementById('check-habit-btn-habit_1');
      expect(dietHabitButton).toBeInTheDocument();

      // Click the button
      if (dietHabitButton) fireEvent.click(dietHabitButton);

      // The mock function should be called with the task ID, checking state, co2, and points
      expect(mockToggle).toHaveBeenCalledTimes(1);
      // The first static habit is "habit_1"
      expect(mockToggle).toHaveBeenCalledWith('habit_1', true, expect.any(Number), expect.any(Number));
    });
  });
});

