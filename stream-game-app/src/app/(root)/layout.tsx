import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <h1 className="text-3xl">NavBar</h1>
      {children}
    </div>
  );
};

export default Layout;
