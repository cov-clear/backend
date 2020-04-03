import { InterpretationRules } from './InterpretationRules';
import { InterpretationTheme } from './Interpretation';
import { Results } from '../Results';
import { UserId } from '../../user/UserId';
import { ConfidenceLevel } from '../ConfidenceLevel';

describe('InterpretationRules', () => {
  it('does not allow creating an invalid interpretation', () => {
    expect(() => InterpretationRules.fromSchema([{}])).toThrow();
  });

  it('produces a correct Interpretation when the condition evaluates to true', () => {
    const interpretationRule = InterpretationRules.fromSchema([
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

  it('produces no interpretation when the condition evaluates to false', () => {
    const interpretationRule = InterpretationRules.fromSchema([
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
    const interpretationRule = InterpretationRules.fromSchema([]);

    const results = new Results(new UserId(), { c: 1 }, ConfidenceLevel.LOW);
    const interpretations = interpretationRule.interpret(results);

    expect(interpretations.length).toEqual(0);
  });

  it('produces multiple interpretations if multiple rules match', () => {
    const interpretationRule = InterpretationRules.fromSchema([
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
      {
        output: {
          namePattern: 'Some other pattern {{value}}',
          theme: InterpretationTheme.NEGATIVE,
          propertyVariables: {
            value: 'c',
          },
        },
        condition: {
          property: 'c',
          comparator: '>',
          value: 1,
        },
      },
    ]);

    const results = new Results(new UserId(), { c: 3 }, ConfidenceLevel.LOW);
    const interpretations = interpretationRule.interpret(results);

    expect(interpretations.length).toEqual(2);
  });
});
