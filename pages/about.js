import { Container, ErrorMessage, Group, Head, Heading, Page, PageHeading, Content } from 'components';
import { getLocaleData } from 'client-api';

const AboutPage = ({ response }) => {

  const { locale, error } = response;

  if (error) return <ErrorMessage error={error} />;

  return (
    <Page id="About">
      <Head/>
      <PageHeading title={locale.pageTitle} />
      <Container>
        <Group>
          <Heading>{locale.sectionOneTitle}</Heading>
          <Content>{locale.sectionOneContent}</Content>
        </Group>
        <Group>
          <Heading>{locale.sectionTwoTitle}</Heading>
          <Content>{locale.sectionTwoContent}</Content>
        </Group>
      </Container>
    </Page>
  );
};

AboutPage.getInitialProps = async () => {
  try {
    const locale = await getLocaleData('page/about').request;
    return { response: { locale } };
  } catch (error) {
    return { response: { error } };
  }
};

export default AboutPage;
