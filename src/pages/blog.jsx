import { Helmet } from 'react-helmet-async';

import { BlogView } from 'src/views/blog/view';

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title> Blog | </title>
      </Helmet>

      <BlogView />
    </>
  );
}
