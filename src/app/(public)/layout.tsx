"use client";

import Header from "@/app/layout/header";

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="">
        <main className="">
            <Header />
            {children}
        </main>
    </div>
  );
};

export default PublicLayout;
