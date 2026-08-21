import Header from "./NavBar";
import Footer from "./Footer";

const PublicLayout = ({ children }) => {
  return (
    <>
      <Header />

      {children}

      <Footer />
    </>
  );
};

export default PublicLayout;