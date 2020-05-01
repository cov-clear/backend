export interface LoginCommand {
  method: 'MAGIC_LINK' | 'ESTONIAN_ID';
  identifier: string;
}
