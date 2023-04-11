import { Head, ComponentChildren, Page, PageHeading } from 'cmsComponents';

const AdminLayoutPage = () => {

  return (
    <Page id="AdminLayout">
      <Head title="Admin | Edit Layout" />
      <PageHeading title="Edit (Layout Name)" />
      <ComponentChildren />
    </Page>
  );
};

export default AdminLayoutPage;
