import { CreateNewMagicLink } from './CreateNewMagicLink';

describe('CreateMagicLink', () => {
  const mockMagicLinkRepository = {
    save: jest.fn(),
    findByCode: jest.fn(),
  };
  const createMagicLink = new CreateNewMagicLink(mockMagicLinkRepository);

  beforeEach(() => {
    // @ts-ignore
    mockMagicLinkRepository.save.mockClear();
  });

  it('creates a new magic link for a given email', async () => {
    await createMagicLink.execute('some@email.com');
    expect(mockMagicLinkRepository.save).toHaveBeenCalled();
  });
});
