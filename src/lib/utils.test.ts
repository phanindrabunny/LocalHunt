import { haversineDistance } from './utils';

describe('haversineDistance', () => {
  it('should calculate the distance between two points correctly', () => {
    // Coordinates for San Francisco and Los Angeles
    const lat1 = 37.7749; // SF
    const lon1 = -122.4194; // SF
    const lat2 = 34.0522; // LA
    const lon2 = -118.2437; // LA

    const distance = haversineDistance(lat1, lon1, lat2, lon2);

    // The actual distance is roughly 559 km. We'll check if it's within a reasonable range.
    expect(distance).toBeGreaterThan(550);
    expect(distance).toBeLessThan(570);
  });

  it('should return 0 for the same coordinates', () => {
    const lat1 = 37.7749;
    const lon1 = -122.4194;

    const distance = haversineDistance(lat1, lon1, lat1, lon1);

    expect(distance).toBe(0);
  });
});
