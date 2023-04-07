import { Container, ErrorMessage, Group, Head, Title, Page, PageTitle, Content } from 'components'
import { getLocaleData } from 'client-api'

const AboutPage = ({ response }) => {

  const { locale, error } = response

  if (error) return <ErrorMessage error={error} />

  return (
    <Page id="About">
      <Head/>
      <PageTitle title={locale.pageTitle} />
      <Container>
        <Group>
          <Title>{locale.sectionOneTitle}</Title>
          <Content>{locale.sectionOneContent}</Content>
        </Group>
        <Group>
          <Title>{locale.sectionTwoTitle}</Title>
          <Content>{locale.sectionTwoContent}</Content>
        </Group>
      </Container>
    </Page>
  )
}

AboutPage.getInitialProps = async () => {
  try {
    const locale = await getLocaleData('page/about').request
    return { response: { locale } }
  } catch (error) {
    return { response: { error } }
  }
}

export default AboutPage
