export interface LoginCommand {
  method: 'MAGIC_LINK' | 'ID_CODE'; // TODO: Should this live separately?
  value: string;
}
