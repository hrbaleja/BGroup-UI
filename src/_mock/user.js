import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const users = [...Array(400)].map((_, index) => {
  const randomIndex = Math.floor(Math.random() * 25) + 1;

  return {
    id: faker.string.uuid(),
    avatarUrl: `/assets/images/avatars/avatar_${randomIndex}.jpg`,
    name: faker.person.fullName(),
    company: faker.company.name(),
    isVerified: faker.datatype.boolean(),
    status: sample(['active', 'banned']),
    role: sample([
      'Leader',
      'Hr Manager',
      'UI Designer',
      'UX Designer',
      'UI/UX Designer',
      'Project Manager',
      'Backend Developer',
      'Full Stack Designer',
      'Front End Developer',
      'Full Stack Developer',
    ]),
  };
});