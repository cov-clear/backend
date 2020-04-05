export interface UserDTO {
  id: string;
  email: string;
  creationTime: Date;
  profile?: ProfileDTO;
  address?: AddressDTO;
}

export interface ProfileDTO {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
}

export interface AddressDTO {
  address1: string;
  address2?: string;
  city: string;
  region?: string;
  postcode: string;
  countryCode: string;
}
