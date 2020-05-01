export interface LoginCommand {
  method: 'MAGIC_LINK' | 'ESTONIAN_ID';
  authCode: string;
}
