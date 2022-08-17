import { Head, Page, Link } from 'cmsComponents'

const AdminContentPage = () => {

  return (
    <Page id="AdminContent">
      <Head title="Admin | Content" />
      This will allow the user to choose whether to edit pages or shared layouts.
      <div><Link href="/admin/content/pages">Pages</Link></div>
      <div><Link href="/admin/content/layouts">Layouts</Link></div>
    </Page>
  )
}

export default AdminContentPage
