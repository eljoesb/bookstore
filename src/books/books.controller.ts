import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { BooksService } from './Books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './schemas/book.schema';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    await this.booksService.create(createBookDto);
  }

  @Get()
  async findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findByID(id);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.deleteOne(id);
  }

  @Delete()
  async delete(): Promise<Book> {
    return this.booksService.deleteAll();
  }
}
