import { Container, ErrorMessage, Group, Head, Page, PageTitle, Content, Title } from 'components'
import { getLocaleData } from 'client-api'

const ExamplesPage = ({ response }) => {

  const { locale, error } = response

  if (error) return <ErrorMessage error={error} />

  return (
    <Page id="Examples">
      <Head/>
      <PageTitle title={locale.pageTitle} />
      <Container>
        <Group>
          <Title>{locale.sectionOneTitle}</Title>
          <Content>{locale.sectionOneContent}</Content>
        </Group>
      </Container>
    </Page>
  )
}

ExamplesPage.getInitialProps = async () => {
  try {
    const locale = await getLocaleData('page/examples').request
    return { response: { locale } }
  } catch (error) {
    return { response: { error } }
  }
}

export default ExamplesPage
