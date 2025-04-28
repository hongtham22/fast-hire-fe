"use client";

import Header from "@/app/layout/header";
import Footer from "../layout/footer";

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="">
        <main className="">
            <Header />
            {children}
            <Footer />
        </main>
    </div>
  );
};

export default PublicLayout;
