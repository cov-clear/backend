declare class Isikukood {
  constructor(id: string);
  getGender(): 'male' | 'female' | 'unknown';
  getBirthday(): Date;
  validate(): boolean;
}

declare module 'isikukood' {
  export = Isikukood;
}
