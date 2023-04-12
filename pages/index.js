import { Container, ErrorMessage, Group, Head, Markdown, Page, PageHeading, Splash, withAPI, Heading, Content } from 'components';
import { getLocaleData } from 'client-api';
import SplashContext from 'components/splash/splashContext';

const LazyLoadExample = withAPI({
  query: 'getLocaleData',
  args: ['item/example'],
}, ({ response }) => {
  return (
    <>
      {response.content.map(({ title, body }) => (
        <div key={title}>
          <Heading>{title}</Heading>
          <Content>{body}</Content>
        </div>
      ))}
    </>
  );
});

const HomePage = ({ response }) => {
  const { locale, error } = response;
  if (error) return <ErrorMessage error={error} />;
  return (
    <SplashContext.Provider value={locale.splash}>
      <Page id="Home">
        <Head/>
        <Splash>
          <PageHeading
            title={locale.title}
            subtitle={locale.subtitle}
          />
        </Splash>
        <Container>
          <Group>
            <Markdown>{locale.main}</Markdown>
          </Group>
          <Group>
            <LazyLoadExample />
          </Group>
        </Container>
      </Page>
    </SplashContext.Provider>
  );
};

HomePage.getInitialProps = async () => {
  try {
    const locale = await getLocaleData('page/home').request;
    return { response: { locale } };
  } catch (error) {
    return { response: { error } };
  }
};

export default HomePage;
