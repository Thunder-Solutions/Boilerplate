import { Container, ErrorMessage, Group, Head, Title, Page, PageTitle, Content, Link, Address } from 'components';
import { getLocaleData } from 'client-api';

const ContactPage = ({ response }) => {

  const { locale, error } = response;

  if (error) return <ErrorMessage error={error} />;

  return (
    <Page id="Contact">
      <Head/>
      <PageTitle title={locale.pageTitle} />
      <Container>
        <Group>
          <Title>{locale.sectionOneTitle}</Title>
          <Content>{locale.sectionOneContent}</Content>
        </Group>
        <Group>
          <Address {...locale.company} isBusiness={true} />
        </Group>
        <Group>
          <Title>{locale.sectionTwoTitle}</Title>
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
