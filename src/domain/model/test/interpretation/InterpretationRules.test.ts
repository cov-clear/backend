import { InterpretationRules } from './InterpretationRules';
import { InterpretationTheme } from './Interpretation';
import { Results } from '../Results';
import { UserId } from '../../user/UserId';
import { ConfidenceLevel } from '../ConfidenceLevel';

describe('InterpretationRules', () => {
  it('produces a correct Interpretation when the condition evaluates to true', () => {
    const interpretationRule = InterpretationRules.from([
      {
        output: {
          namePattern: 'Some pattern {{value}}',
          theme: InterpretationTheme.NEGATIVE,
          propertyVariables: {
            value: 'c',
          },
        },
        condition: {
          property: 'c',
          comparator: '>',
          value: 2,
        },
      },
    ]);

    const results = new Results(new UserId(), { c: 3 }, ConfidenceLevel.LOW);
    const interpretations = interpretationRule.interpret(results);

    expect(interpretations[0]?.name).toEqual('Some pattern {{value}}');
    expect(interpretations[0]?.theme).toEqual(InterpretationTheme.NEGATIVE);
    expect(interpretations[0]?.variables.get('value')).toEqual(3);
  });

  it('produces a null result when the condition evaluates to false', () => {
    const interpretationRule = InterpretationRules.from([
      {
        output: {
          namePattern: 'Some pattern {{value}}',
          theme: InterpretationTheme.NEGATIVE,
          propertyVariables: {
            value: 'c',
          },
        },
        condition: {
          property: 'c',
          comparator: '>',
          value: 2,
        },
      },
    ]);

    const results = new Results(new UserId(), { c: 1 }, ConfidenceLevel.LOW);
    const interpretations = interpretationRule.interpret(results);

    expect(interpretations.length).toEqual(0);
  });

  it('produces no interpretations for an empty interpretation rule array', () => {
    const interpretationRule = InterpretationRules.from([]);

    const results = new Results(new UserId(), { c: 1 }, ConfidenceLevel.LOW);
    const interpretations = interpretationRule.interpret(results);

    expect(interpretations.length).toEqual(0);
  });
});
