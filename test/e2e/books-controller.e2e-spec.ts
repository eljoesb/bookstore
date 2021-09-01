import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { Book, BookDocument } from '../../src/books/schemas/book.schema';
import { BooksModule } from '../../src/books/books.module';

describe('Books controller', () => {
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
      title: 'test',
      author: 'test',
    };
    return bookModel.create(mockBook);
  });

  afterEach(() => {
    bookModel.remove({});
  });

  it('POST /books', () => {
    return request(app.getHttpServer())
      .post('/books')
      .expect(201)
      .send({ title: 'prueba', author: 'prueba' });
  });

  it('GET /books', async () => {
    const result = await request(app.getHttpServer()).get('/books').expect(200);
    expect(result.body[0].title).toStrictEqual('prueba');
  });

  it('GET /books/:id', async () => {
    const result = await request(app.getHttpServer()).get(
      '/books/612e9d8e4e6bb55fbbd47094',
    );
    expect(result.statusCode).toEqual(200);
  });

  it('GET /books/:id', async () => {
    const result = await request(app.getHttpServer()).get('/books/123');
    expect(result.statusCode).toEqual(500);
  });

  afterAll(() => {
    mongo.stop();
    app.close();
  });
});
