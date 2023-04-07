import { Head, Page, Link } from 'cmsComponents';

const AdminLayoutsPage = () => {

  return (
    <Page id="AdminPages">
      <Head title="Admin | Edit Layouts" />
      This will be a list of layouts. Choose one to edit/delete or add new.
      <div><Link href="/admin/content/layouts/layout">Dummy Layout</Link></div>
    </Page>
  );
};

export default AdminLayoutsPage;
