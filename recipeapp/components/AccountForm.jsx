import {useState} from "react";

const AccountForm = ({ user, handleEdit }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    handleEdit(username, email, password);
  };

  return (
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <InputField id="username" label="Username" value={username} onChange={setUsername} />
        <InputField id="email" label="Email" type="email" value={email} onChange={setEmail} />
        <InputField id="password" label="Password" type="password" value={password} onChange={setPassword} />
        <div className="flex items-center justify-between">
          <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
          >
            Update
          </button>
        </div>
      </form>
  );
};

export default AccountForm;

const InputField = ({ id, label, type = 'text', value, onChange }) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
        {label}
      </label>
      <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
      />
    </div>
);