import { Head, Page, PageHeading, Button } from 'cmsComponents';

const AdminPage = () => {

  return (
    <Page id="Admin">
      <Head title="Admin" />
      <PageHeading title="Admin: Log In" />
      <Button.Link href="/admin/content">Log In</Button.Link>
    </Page>
  );
};

export default AdminPage;
