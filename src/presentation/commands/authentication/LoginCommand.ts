export interface LoginCommand {
  method: 'MAGIC_LINK' | 'ESTONIAN_ID';
  value: string;
}
