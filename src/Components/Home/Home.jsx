import Feature from "./Feature/Feature";
import NewReleases from "./NewReleases/NewReleases";

const Home = ({ user }) => {
  return (
    <>
      <Feature />
      <NewReleases user={user} />
    </>
  );
};

export default Home;
