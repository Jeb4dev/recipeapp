import Layout from "../components/layout";

const AccountPage = () => {
  const dummyData = {
    name: "John Doe",
    email: "john.doe@example.com",
    address: "123 Main St, Anytown, USA",
  };

  return (
    <Layout>
      <div className="p-4 outline outline-amber-200">
        <h1 className="text-2xl font-bold mb-4">Account Page</h1>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <p className="text-gray-600">{dummyData.name}</p>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <p className="text-gray-600">{dummyData.email}</p>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="address"
            >
              Address
            </label>
            <p className="text-gray-600">{dummyData.address}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
