export interface RestaurantVerifyStatusCountResponse {
  total: number;

  emailPending: number;

  pending: number;

  approved: number;

  rejected: number;
}
