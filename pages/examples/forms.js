import { Container, ErrorMessage, Group, Head, Page, PageTitle, Form, Input, Content, Button, Textarea, Fieldset, Select } from 'components';
import { getLocaleData } from 'client-api';

const FormsPage = ({ response }) => {

  const { locale, error } = response;

  const handleTestForm = async (data) => {
    await new Promise((resolve) => setTimeout(() => resolve(), 1000));
  };

  if (error) return <ErrorMessage error={error} />;

  return (
    <Page id="To Dos">
      <Head/>
      <PageTitle title={locale.pageTitle} />
      <Container>
        <Group>
          <Content>{locale.content}</Content>
        </Group>
        <Group>
          <Form onSubmit={handleTestForm}>
            <Fieldset legend="Test Fields">
              <Select label="Select One" name="options" required>
                <option value="1">Option One</option>
                <option value="2">Option Two</option>
                <option value="3">Option Three</option>
              </Select>
              <Input label="Field One" name="field_one" required />
              <Textarea label="Field Two" name="field_two" required />
            </Fieldset>
            <Button>Submit</Button>
            <Button.Link href="/">Back to Home</Button.Link>
          </Form>
        </Group>
      </Container>
    </Page>
  );
};

FormsPage.getInitialProps = async () => {
  try {
    const locale = await getLocaleData('page/forms').request;
    return { response: { locale } };
  } catch (error) {
    return { response: { error } };
  }
};

export default FormsPage;
