import Link from 'next/link';

const pages = [
  { href: '/lectios', title: 'Lectios', description: 'Listagem de lectios e leitura de detalhes.' },
  { href: '/auth', title: 'Autenticação', description: 'Registro, login, refresh, logout e usuário atual.' },
  { href: '/tags', title: 'Tags', description: 'Cadastro e listagem de tags.' },
];

export default function Home() {
  return (
    <main className="container py-5">
      <h1 className="mb-2">Lectio Divina · Frontend</h1>
      <p className="text-secondary mb-4">Escolha uma área para acessar o fluxo específico.</p>

      <div className="row g-3">
        {pages.map((page) => (
          <div className="col-12 col-md-6 col-lg-4" key={page.href}>
            <Link href={page.href} className="card h-100 text-decoration-none">
              <div className="card-body">
                <h2 className="h5 card-title text-dark">{page.title}</h2>
                <p className="card-text text-secondary">{page.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
