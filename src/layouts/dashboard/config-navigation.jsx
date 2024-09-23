import { PATHS } from 'src/routes/routes';

import SvgColor from 'src/components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

export const navConfig = [
  {
    title: 'dashboard',
    path: PATHS.INDEX,
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: PATHS.USER,
    icon: icon('ic_user'),
  },
  {
    title: 'Account',
    path: PATHS.ACCOUNT,
    icon: icon('ic_money'),
  },
  {
    title: 'Companies',
    path: PATHS.COMPANIES,
    icon: icon('ic_analytics'),
  },
  {
    title: 'Transaction',
    path: PATHS.TRANSACTION,
    icon: icon('ic_lock'),
  },
  {
    title: 'Income',
    path: PATHS.INCOME,
    icon: icon('ic_money'),

  },
  {
    title: 'Other Income',
    path: PATHS.OTHER_INCOME,
    icon: icon('ic_money'),
  },
  {
    title: 'product',
    path: PATHS.PRODUCTS,
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: PATHS.BLOG,
    icon: icon('ic_blog'),
  },
];

export default navConfig;
