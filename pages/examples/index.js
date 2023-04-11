import { Container, ErrorMessage, Group, Head, Page, PageHeading, Content, Title } from 'components';
import { getLocaleData } from 'client-api';

const ExamplesPage = ({ response }) => {

  const { locale, error } = response;

  if (error) return <ErrorMessage error={error} />;

  return (
    <Page id="Examples">
      <Head/>
      <PageHeading title={locale.pageTitle} />
      <Container>
        <Group>
          <Heading>{locale.sectionOneTitle}</Heading>
          <Content>{locale.sectionOneContent}</Content>
        </Group>
      </Container>
    </Page>
  );
};

ExamplesPage.getInitialProps = async () => {
  try {
    const locale = await getLocaleData('page/examples').request;
    return { response: { locale } };
  } catch (error) {
    return { response: { error } };
  }
};

export default ExamplesPage;
