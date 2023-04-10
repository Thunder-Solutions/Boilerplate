import { Head, ComponentChildren, Page, PageHeading } from 'cmsComponents';

const AdminPagePage = () => {

  return (
    <Page id="AdminPage">
      <Head title="Admin | Edit Page" />
      <PageHeading title="Edit (Page Name)" />
      <ComponentChildren />
    </Page>
  );
};

export default AdminPagePage;
