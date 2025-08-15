
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 animated-background">{children}</main>
        <Footer />
    </div>
  );
}
