export interface CreateUserCommand {
  authenticationDetails: {
    method: string;
    identifier: string;
  };
  roles: string[];
}
