import { Helmet } from 'react-helmet-async';

import { ProductsView } from 'src/views/products/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Products | </title>
      </Helmet>

      <ProductsView />
    </>
  );
}
