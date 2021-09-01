import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { Book, BookDocument } from '../../src/books/schemas/book.schema';
import { BooksModule } from '../../src/books/books.module';

describe.skip('Books controller', () => {
  let bookModel;
  let app;
  let mongo;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongo = await MongoMemoryServer.create();
            const uri = mongo.getUri();
            return {
              uri,
            };
          },
        }),
        BooksModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    bookModel = moduleFixture.get<Model<BookDocument>>(
      getModelToken(Book.name),
    );
    await app.init();
  });

  beforeEach(() => {
    const mockBook = {
      title: 'test-prueba',
      author: 'test',
    };
    return bookModel.create(mockBook);
  });

  it('POST /books', async () => {
    return await request(app.getHttpServer())
      .post('/books')
      .send({ title: 'E2E Testing', author: 'JV' })
      .expect(201);
  });

  it('GET /books', async () => {
    const result = await request(app.getHttpServer()).get('/books');
    expect(result.body[0].title).toBe('test-prueba');
  });

  it('GET /books', async () => {
    const result = await request(app.getHttpServer()).get('/books').expect(200);
    expect(result.body.length > 0).toBeTruthy();
  });

  it.skip('GET /books/:id', async () => {
    const result = await request(app.getHttpServer()).get(
      '/books/612fb9db3c7b4e2731f9eead',
    );
    expect(result.statusCode).toEqual(200);
  });

  it.skip('GET /books/:id', async () => {
    const result = await request(app.getHttpServer()).get(
      '/books/qwertyui0123456789',
    );
    expect(result.statusCode).toEqual(500);
  });

  it.skip('DELETE /books', async () => {
    const result = await request(app.getHttpServer()).delete('/books');
    expect(result.statusCode).toEqual(200);
  });

  // afterEach(() => {
  //   bookModel.remove({});
  // });

  afterAll(() => {
    mongo.stop();
    app.close();
  });
});
