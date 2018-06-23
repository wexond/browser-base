export const metersPerSecondToKilometersPerHour = (value: number) => value * 3.6;

export const metersPerSecondToMilesPerHour = (value: number) => metersPerSecondToKilometersPerHour(value * 0.00062137);
