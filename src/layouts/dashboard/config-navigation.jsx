import { PATHS, CATEGORIES } from 'src/routes/routes';

import SvgColor from 'src/components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

export const navConfig = [
  {
    title: 'Dashboard',
    path: PATHS.DASHBOARD,
    icon: icon('ic_dashboard'),
    category: CATEGORIES.GENERAL,
  },
  {
    title: 'User',
    path: PATHS.USER,
    icon: icon('ic_user'),
    category: CATEGORIES.GENERAL,
  },
  {
    title: 'Account',
    path: PATHS.ACCOUNT,
    icon: icon('ic_account'),
    category: CATEGORIES.ACCOUNT,
  },
  // {
  //   title: 'Companies',
  //   path: PATHS.COMPANIES,
  //   icon: icon('ic_companies'),
  //   category: CATEGORIES.COMPANIES,

  // },
  // {
  //   title: 'Transaction',
  //   path: PATHS.TRANSACTION,
  //   icon: icon('ic_transaction'),
  //   category: CATEGORIES.COMPANIES,

  // },
  // {
  //   title: 'Income',
  //   path: PATHS.INCOME,
  //   icon: icon('ic_income2'),
  //   category: CATEGORIES.COMPANIES,
  // },
  {
    title: 'Source',
    path: PATHS.OTHER_INCOME,
    icon: icon('ic_income'),
    category: CATEGORIES.OTHER,
  },
  {
    title: 'Contacts',
    path: PATHS.CONTACTS,
    icon: icon('contacts'),
    category: CATEGORIES.USER,
  },
];

export default navConfig;
