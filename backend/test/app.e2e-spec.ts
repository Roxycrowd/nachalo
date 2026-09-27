import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ApiExceptionFilter } from '../src/common/filters/api-exception.filter';

describe('Health (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new ApiExceptionFilter());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/health reports the API and the database', async () => {
    const response = await request(app.getHttpServer()).get('/api/health');

    expect([200, 503]).toContain(response.status);
    if (response.status === 200) {
      expect(parseJson(response.text)).toEqual({
        status: 'ok',
        service: 'vibe-api',
        database: 'up',
      });
      return;
    }

    expect(readField(response.text, 'message')).toBe('База данных недоступна');
  });

  it('registers a session without returning secrets', async () => {
    const health = await request(app.getHttpServer()).get('/api/health');
    if (health.status !== 200) {
      return;
    }

    const password = 'correct-horse';
    const email = `person-${Date.now()}@example.com`;
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email,
        password,
        username: `person_${Date.now()}`,
        name: 'Person',
      });

    expect(response.status).toBe(201);
    expect(response.text).not.toContain(password);
    expect(response.text).not.toMatch(/passwordHash|accessToken|refreshToken/);
    expect(readField(response.text, 'email')).toBe(email);

    const setCookie = response.headers['set-cookie'];
    const cookieHeader = Array.isArray(setCookie)
      ? setCookie.join(';')
      : String(setCookie);
    expect(cookieHeader.toLowerCase()).toContain('httponly');

    const me = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Cookie', Array.isArray(setCookie) ? setCookie : []);
    expect(me.status).toBe(200);
    expect(readField(me.text, 'username')).toBe(
      readField(response.text, 'username'),
    );

    const vibe = await request(app.getHttpServer())
      .get('/api/vibe/me')
      .set('Cookie', Array.isArray(setCookie) ? setCookie : []);
    expect(vibe.status).toBe(200);
    expect(parseJson(vibe.text)).toEqual({ items: [] });
  });

  it('GET /api/integrations/providers does not include tokens', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/integrations/providers',
    );

    expect(response.status).toBe(200);
    expect(response.text).not.toMatch(/accessToken|refreshToken/i);
    expect(parseJson(response.text)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'spotify', status: 'not_implemented' }),
        expect.objectContaining({ id: 'anilist', status: 'not_implemented' }),
        expect.objectContaining({ id: 'steam', status: 'not_implemented' }),
      ]),
    );
  });
});

function parseJson(text: string): unknown {
  return JSON.parse(text) as unknown;
}

function readField(text: string, key: string): unknown {
  const value = parseJson(text);
  if (!isRecord(value) || !Object.hasOwn(value, key)) {
    return undefined;
  }
  return value[key];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
