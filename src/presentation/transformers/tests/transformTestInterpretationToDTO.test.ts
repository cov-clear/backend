import { transformTestInterpretationToDTO } from './transformTestInterpretationToDTO';
import { Interpretation, InterpretationTheme } from '../../../domain/model/test/interpretation/Interpretation';

describe('transformTestInterpretationToDTO', () => {
  it('correctly transforms a test type', () => {
    const interpretation = new Interpretation(
      'PCR score: {{score}}',
      InterpretationTheme.POSITIVE,
      new Map(Object.entries({ score: '300' }))
    );

    const interpretationDTO = transformTestInterpretationToDTO(interpretation);

    expect(interpretationDTO.name).toEqual('PCR score: 300');
    expect(interpretationDTO.theme).toEqual(InterpretationTheme.POSITIVE);
  });
});
