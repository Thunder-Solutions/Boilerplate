import NextHead from 'next/head';

const Head = ({ children, title: _title, meta = {} }) => {

  const SITE_TITLE = 'Thunder Solutions';
  const SITE_ROOT_URL = 'https://thunder.solutions';

  const DEFAULT_META = {
    title: 'Thunder Solutions LLC',
    description: 'Thunder Solutions is a technology and design company based in Pittsburgh, PA.',
    url: '',
    image: '/images/meta.gif',
  };

  const {
    title,
    description,
    url,
    image,
  } = {
    ...DEFAULT_META,
    ...meta,
  };

  const fullTitle = `${SITE_TITLE}${_title ? ` | ${_title}` : ''}`;

  return (
    <NextHead>
      <title>{fullTitle}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${SITE_ROOT_URL}${url}`} />
      <meta property="og:image" content={`${SITE_ROOT_URL}${image}`} />
      <meta property="og:type" content="website" />
      <meta name="description" content={description} />
      {children}
    </NextHead>
  );
};

export default Head;
