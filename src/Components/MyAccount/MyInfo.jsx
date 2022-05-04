import { useContext, useState } from "react";
import { userContext } from "../../App";
const MyInfo = () => {
  const [user, setUser] = useContext(userContext);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  return (
    <form>
      <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button>Update Info</button>
    </form>
  );
};

export default MyInfo;
