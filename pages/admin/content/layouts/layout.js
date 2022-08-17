import { Head, ComponentChildren, Page, PageTitle } from 'cmsComponents'

const AdminLayoutPage = () => {

  return (
    <Page id="AdminLayout">
      <Head title="Admin | Edit Layout" />
      <PageTitle title="Edit (Layout Name)" />
      <ComponentChildren />
    </Page>
  )
}

export default AdminLayoutPage
