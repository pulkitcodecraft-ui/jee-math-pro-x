import AppNavbar from '@/components/app/AppNavbar';
import AppFooter from '@/components/app/AppFooter';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNavbar />
      <div className="flex-1">{children}</div>
      <AppFooter />
    </>
  );
}
