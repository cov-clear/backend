export interface CreateUserCommand {
  authenticationDetails: {
    method: string;
    value: string;
  };
  roles: string[];
}
