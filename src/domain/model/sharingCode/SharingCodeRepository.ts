import { SharingCode } from './SharingCode';

export interface SharingCodeRepository {
  save(sharingCode: SharingCode): Promise<SharingCode>;

  findByCode(code: string): Promise<SharingCode | null>;
}
