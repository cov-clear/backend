export interface AccessPassDTO {
  userId: string;
  expiryTime: Date;
}

export interface SharingCodeDTO {
  code: string;
  expiryTime: Date;
}
