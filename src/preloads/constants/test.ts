import { IFormFillData } from '~/interfaces';

export const TEST_DATA: IFormFillData[] = [ // Hard coded for tests
  {
    _id: 'a',
    type: 'address',
    fields: {
      name: 'Big Skrrt Krzak',
      address: 'Krzakowska 21',
      postCode: '18-07',
      city: 'Krzakowo',
      country: 'pl',
      phone: '123 456 789',
      email: 'bigkrzak@wexond.net',
    },
  },
]
