export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  documentType: 'dni' | 'passport';
  documentNumber: string;
}

export interface BookingRequest {
  flightId: string;
  passengers: Passenger[];
}

export interface BookingConfirmation {
  id: string;
  pnr: string;
  flightId: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  passengers: Passenger[];
  totalPrice: number;
  status: 'confirmed' | 'pending';
  createdAt: string;
}
