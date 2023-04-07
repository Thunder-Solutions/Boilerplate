import { Container, ErrorMessage, Group, Head, Page, PageTitle, ToDos, Content } from 'components'
import { getLocaleData } from 'client-api'

const ToDoPage = ({ response }) => {

  const { locale, error } = response

  if (error) return <ErrorMessage error={error} />

  return (
    <Page id="To Dos">
      <Head/>
      <PageTitle title={locale.pageTitle} />
      <Container>
        <Group>
          <Content>{locale.content}</Content>
        </Group>
        <Group>
          <ToDos/>
        </Group>
      </Container>
    </Page>
  )
}

ToDoPage.getInitialProps = async () => {
  try {
    const locale = await getLocaleData('page/to-dos').request
    return { response: { locale } }
  } catch (error) {
    return { response: { error } }
  }
}

export default ToDoPage
