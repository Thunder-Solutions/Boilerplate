import { Head, ComponentChildren, Page, PageTitle } from 'cmsComponents'

const AdminPagePage = () => {

  return (
    <Page id="AdminPage">
      <Head title="Admin | Edit Page" />
      <PageTitle title="Edit (Page Name)" />
      <ComponentChildren />
    </Page>
  )
}

export default AdminPagePage
