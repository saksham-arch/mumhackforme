import { HelmetProvider, Helmet } from "react-helmet-async";
import { ThemeProvider } from 'next-themes';
import { CurrencyProvider } from '@/hooks/use-currency';

const PageMeta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="system">
      <CurrencyProvider>{children}</CurrencyProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default PageMeta;
