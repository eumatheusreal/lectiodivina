import type { ReactNode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata = {
  title: 'Lectio Divina',
  description: 'Frontend para testar a API de lectio divina',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-light">{children}</body>
    </html>
  );
}
