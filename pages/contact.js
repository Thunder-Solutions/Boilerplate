import { Container, ErrorMessage, Group, Head, Heading, Page, PageHeading, Content, Link, Address } from 'components';
import { getLocaleData } from 'client-api';

const ContactPage = ({ response }) => {

  const { locale, error } = response;

  if (error) return <ErrorMessage error={error} />;

  return (
    <Page id="Contact">
      <Head/>
      <PageHeading title={locale.pageTitle} />
      <Container>
        <Group>
          <Heading>{locale.sectionOneTitle}</Heading>
          <Content>{locale.sectionOneContent}</Content>
        </Group>
        <Group>
          <Address {...locale.company} isBusiness={true} />
        </Group>
        <Group>
          <Heading>{locale.sectionTwoTitle}</Heading>
          <Content>{locale.sectionTwoContent}</Content>
        </Group>
        <Group>
          {locale.directory.map((contact, idx) => (
            <Address {...contact} key={idx} />
          ))}
        </Group>
      </Container>
    </Page>
  );
};

ContactPage.getInitialProps = async () => {
  try {
    const locale = await getLocaleData('page/contact').request;
    return { response: { locale } };
  } catch (error) {
    return { response: { error } };
  }
};

export default ContactPage;
