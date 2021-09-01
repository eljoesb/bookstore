import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';
import { BooksModule } from '../../src/books/books.module';
import { BooksService } from '../../src/books/Books.service';

describe('Books controller Other Alternative', () => {
  let app;
  const serviceMock = {
    create: (data) => {
      console.log(data, 'Execute');
      return data;
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test'),
        BooksModule,
      ],
    })
      .overrideProvider(BooksService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('POST /books', async () => {
    return await request(app.getHttpServer())
      .post('/books')
      .send({ title: 'Other Alternative', author: 'Jonathan Villavicencio' })
      .expect(201);
  });

  afterAll(() => {
    app.close();
  });
});
