import { CreateNewMagicLink } from './createNewMagicLink';
import magicLinkRepository from '../../domain/model/magiclink/MagicLinkRepository';

jest.mock('../../domain/model/MagicLinkRepository');

describe('CreateMagicLink', () => {
  const createMagicLink = new CreateNewMagicLink(magicLinkRepository);

  beforeEach(() => {
    // @ts-ignore
    magicLinkRepository.save.mockClear();
  });

  it('creates a new magic link for a given email', async () => {
    await createMagicLink.execute('some@email.com');
    expect(magicLinkRepository.save).toHaveBeenCalled();
  });
});
