import { Interpretation } from '../../../domain/model/test/interpretation/Interpretation';
import { TestInterpretationDTO } from '../../dtos/tests';

export function transformTestInterpretationToDTO(interpretation: Interpretation): TestInterpretationDTO {
  let name = interpretation.name;
  interpretation.variables.forEach((value, key) => {
    name = name.replace(`{{${key}}}`, value);
  });
  return {
    name: name,
    theme: interpretation.theme,
  };
}
