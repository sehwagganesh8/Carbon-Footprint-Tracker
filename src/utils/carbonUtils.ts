import { CalculatedResults } from '../types';

export interface CalculationInputs {
  transportType: string;
  distance: number;
  dietType: string;
  electricity: number;
  heatingType: string;
}

export const calculateFootprint = (inputs: CalculationInputs): CalculatedResults => {
  const { transportType, distance, dietType, electricity, heatingType } = inputs;

  // 1. Transportation Calculation (kg CO2 per km)
  const transportFactors: Record<string, number> = {
    petrol: 0.192,
    diesel: 0.171,
    hybrid: 0.104,
    electric: 0.045, // grid average loading
    public: 0.035,   // generic bus/train combo
    bike_walk: 0.00
  };
  // Edge Case Handling: ensure non-negative distance
  const validDistance = Math.max(0, distance);
  const factor = transportFactors[transportType] ?? 0.192;
  const transportEmissions = Math.round(validDistance * factor);

  // 2. Diet Calculation (Monthly averages in kg CO2)
  const dietFactors: Record<string, number> = {
    heavy_meat: 280,     // Heavy beef / lamb consumption
    moderate_meat: 190,  // Mixed poultry, pork, low beef
    low_meat: 120,       // Mostly vegan/vegetarian with occasional chicken or fish
    vegetarian: 85,      // Dairy and eggs, no flesh
    vegan: 50            // Direct plant pipeline
  };
  const dietEmissions = dietFactors[dietType] ?? 190;

  // 3. Home Energy Calculation (Monthly kg CO2)
  const electricityFactor = 0.35; // average grid index per kWh
  const heatingFlatRates: Record<string, number> = {
    gas: 140,
    electric: 80,
    biomass: 35,
    none: 0
  };
  
  // Edge Case Handling: ensure non-negative electricity usage
  const validElectricity = Math.max(0, electricity);
  const electricityEmissions = Math.round(validElectricity * electricityFactor);
  const heatingEmissions = heatingFlatRates[heatingType] ?? 140;
  const energyEmissions = electricityEmissions + heatingEmissions;

  const total = transportEmissions + dietEmissions + energyEmissions;

  return {
    transport: transportEmissions,
    diet: dietEmissions,
    energy: energyEmissions,
    total,
    answers: {
      transportType,
      distance: validDistance,
      dietType,
      electricity: validElectricity,
      heatingType
    }
  };
};
