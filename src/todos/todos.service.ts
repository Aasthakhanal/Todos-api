import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class TodosService {
  constructor(private readonly prismaService: PrismaService,
    private readonly userService: UsersService
  ){}

  async create(createTodoDto: CreateTodoDto) {
    await this.checkIfTodoExists(createTodoDto.title);
    return this.prismaService.todo.create({data: createTodoDto});
  }

  findAll() {
    return this.prismaService.todo.findMany();
  }

  findOne(id: number) {
    return this.getTodo(id);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    await this.getTodo(id);
    await this.checkIfTodoExists(updateTodoDto.title, id);

    return this.prismaService.todo.update({
      where: { id },
      data: updateTodoDto,
    });

  }

  async remove(id: number) {
    await this.getTodo(id);

    return this.prismaService.todo.delete({ where: { id } }); 
  }


  private async getTodo(id: number) {
    const todo = await this.prismaService.todo.findFirst({ where: { id } });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  private async checkIfTodoExists(title: string, id?: number) {
    const doesTodoExist = await this.prismaService.todo.findFirst({
      where: { title },
    });
    if (doesTodoExist) {
      if (id && doesTodoExist.id !== id) {
        //this is update case
        throw new BadRequestException(`Todo ${title} already exists`);
      } else if (!id) {
        //this is create case
        throw new BadRequestException(`Todo ${title} already exists`);
      }
    }
  }
   
}
