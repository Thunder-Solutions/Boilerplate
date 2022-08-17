import NextHead from 'next/head'

const Head = ({ children, title: _title, meta = {} }) => {

  const SITE_TITLE = 'Thunder Solutions'
  const SITE_ROOT_URL = 'https://thunder.solutions'

  const DEFAULT_META = {
    title: 'CMS Portal',
    description: 'An administrative portal and CMS.',
    url: '/admin',
    image: '/images/cms-meta.gif',
  }

  const {
    title,
    description,
    url,
    image,
  } = {
    ...DEFAULT_META,
    ...meta,
  }

  return (
    <NextHead>
      <title>{SITE_TITLE}{_title ? ` | ${_title}` : ''}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${SITE_ROOT_URL}${url}`} />
      <meta property="og:image" content={`${SITE_ROOT_URL}${image}`} />
      <meta property="og:type" content="website" />
      <meta name="description" content={description} />
      {children}
    </NextHead>
  )
}

export default Head
