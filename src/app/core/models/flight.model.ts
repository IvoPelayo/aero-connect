export interface Airport {
  code: string;
  city: string;
  country: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  origin: Airport;
  destination: Airport;
  departureDate: string;
  arrivalDate: string;
  durationMinutes: number;
  basePrice: number;
  availableSeats: number;
  airline: string;
  status: 'scheduled' | 'delayed' | 'cancelled';
}

export interface SearchParams {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}
