import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Regras de negócio (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1) deve exigir e-mail e senha no login', async () => {
    const response = await request(app.getHttpServer()).post('/api/auth/login').send({ email: '' });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('E-mail ou senha incorretos');
  });

  it('1) deve retornar erro de credenciais quando payload for vazio no login', async () => {
    const response = await request(app.getHttpServer()).post('/api/auth/login').send({});
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('E-mail ou senha incorretos');
  });

  it('2) não deve permitir criar lectio sem tag', async () => {
    const response = await request(app.getHttpServer()).post('/api/lectios').send({
      title: 'Lectio X',
      date: new Date().toISOString(),
      bibleReference: 'Jo 3:16',
      bibleText: 'Texto',
      promises: 'Promessas',
      commands: 'Mandamentos',
      eternalPrinciples: 'Princípios',
      meditation: 'Meditação',
      prayer: 'Oração',
      practicalApplication: 'Aplicação',
      tagIds: [],
      isFavorite: false,
    });
    expect(response.status).toBe(400);
  });

  it('3) deve exigir todos os campos obrigatórios da lectio', async () => {
    const response = await request(app.getHttpServer()).post('/api/lectios').send({
      title: 'Lectio incompleta',
      tagIds: ['t1'],
      isFavorite: false,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(expect.arrayContaining([
      expect.stringContaining('bibleReference'),
      expect.stringContaining('bibleText'),
      expect.stringContaining('promises'),
      expect.stringContaining('commands'),
      expect.stringContaining('eternalPrinciples'),
      expect.stringContaining('meditation'),
      expect.stringContaining('prayer'),
      expect.stringContaining('practicalApplication'),
    ]));
  });

  it('4) deve conseguir incluir um usuário e uma lectio normalmente', async () => {
    const register = await request(app.getHttpServer()).post('/api/auth/register').send({
      name: 'Maria',
      email: 'maria@example.com',
      password: '123456',
    });
    expect(register.status).toBe(201);

    const lectio = await request(app.getHttpServer()).post('/api/lectios').send({
      title: 'Lectio completa',
      date: new Date().toISOString(),
      bibleReference: 'Jo 3:16',
      bibleText: 'Porque Deus amou o mundo...',
      promises: 'Vida eterna',
      commands: 'Crer em Jesus',
      eternalPrinciples: 'Amor de Deus',
      meditation: 'Refletir no amor',
      prayer: 'Senhor, aumenta minha fé',
      practicalApplication: 'Praticar caridade',
      tagIds: ['tag-1'],
      isFavorite: false,
    });
    expect(lectio.status).toBe(201);
    expect(lectio.body.id).toBeDefined();
  });
});
