export class Interpretation {
  constructor(readonly name: string, readonly theme: InterpretationTheme, readonly variables: Map<string, string>) {}
}

export enum InterpretationTheme {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL',
  MUTED = 'MUTED',
}
