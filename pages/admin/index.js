import { Head, Page, PageTitle, Button } from 'cmsComponents';

const AdminPage = () => {

  return (
    <Page id="Admin">
      <Head title="Admin" />
      <PageTitle title="Admin: Log In" />
      <Button.Link href="/admin/content">Log In</Button.Link>
    </Page>
  );
};

export default AdminPage;
