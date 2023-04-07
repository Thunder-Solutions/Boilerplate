import { Head, Page, Link } from 'cmsComponents'

const AdminPagesPage = () => {

  return (
    <Page id="AdminPages">
      <Head title="Admin | Edit Pages" />
      This will be a list of pages. Choose one to edit/delete or add new.
      <div><Link href="/admin/content/pages/page">Dummy Page</Link></div>
    </Page>
  )
}

export default AdminPagesPage
