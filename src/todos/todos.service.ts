import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private readonly prismaService: PrismaService){}
  async create(createTodoDto: CreateTodoDto) {
    const todoExists = await this.prismaService.todo.findFirst({
      where: { 
        title: createTodoDto.title, 
        user_id: createTodoDto.user_id },
    });

    if (todoExists) {
      throw new ConflictException(`Todo ${createTodoDto.title} already exists`);
    }

    const todo = await this.prismaService.todo.create({
      data: createTodoDto,});

    return todo;
  }

  async findAll(user_id: number) {
    return this.prismaService.todo.findMany({
      where: { user_id }},
  );
  }

  async findOne(id: number, user_id: number) {
    return this.getTodo(id, user_id);
  }

  async update(id: number,user_id: number, updateTodoDto: UpdateTodoDto) {
    await this.getTodo(id, user_id);
    if (updateTodoDto.title){
      await this.checkIfTodoExists(updateTodoDto.title, id, user_id);
    }
    return this.prismaService.todo.update({ where: { id, user_id }, data: updateTodoDto});
  }

  async remove(id: number, user_id: number) {
    await this.getTodo(id, user_id);
    return this.prismaService.todo.delete({ where: { id, user_id }});
  }

  private async getTodo(id: number, user_id: number){
    const todo = await this.prismaService.todo.findFirst({ where: { id, user_id } });

    if (!todo){ 
      throw new NotFoundException('TODO not found');
    }
    return todo;
  }

  private async checkIfTodoExists(title: string,user_id: number, id?: number){
    const doesTodoExist = await this.prismaService.todo.findFirst({ where: { title, user_id },});
    if (doesTodoExist){ 
      if (id && doesTodoExist.id !== id){
        throw new BadRequestException(`TODO ${title} already exists`);
      } else if (!id){
        throw new BadRequestException(`TODO ${title} already exists`);
      }
    }
  }
}
// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { CreateTodoDto } from './dto/create-todo.dto';
// import { UpdateTodoDto } from './dto/update-todo.dto';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { UsersService } from 'src/users/users.service';


// @Injectable()
// export class TodosService {
//   constructor(private readonly prismaService: PrismaService,
//     private readonly userService: UsersService
//   ){}

//   async create(createTodoDto: CreateTodoDto) {
//     await this.checkIfTodoExists(createTodoDto.title);
//     return this.prismaService.todo.create({data: createTodoDto});
//   }

//   findAll(user_id: number) {
//     return this.prismaService.todo.findMany();
//   }

//   findOne(id: number, user_id: number) {
//     return this.getTodo(id);
//   }

//   async update(id: number, user_id: number, updateTodoDto: UpdateTodoDto) {
//     await this.getTodo(id);
//     await this.checkIfTodoExists(updateTodoDto.title, id);

//     return this.prismaService.todo.update({
//       where: { id },
//       data: updateTodoDto,
//     });

//   }

//   async remove(id: number, user_id: number) {
//     await this.getTodo(id);

//     return this.prismaService.todo.delete({ where: { id } }); 
//   }


//   private async getTodo(id: number) {
//     const todo = await this.prismaService.todo.findFirst({ where: { id } });
//     if (!todo) {
//       throw new NotFoundException('Todo not found');
//     }

//     return todo;
//   }

//   private async checkIfTodoExists(title: string, id?: number) {
//     const doesTodoExist = await this.prismaService.todo.findFirst({
//       where: { title },
//     });
//     if (doesTodoExist) {
//       if (id && doesTodoExist.id !== id) {
//         //this is update case
//         throw new BadRequestException(`Todo ${title} already exists`);
//       } else if (!id) {
//         //this is create case
//         throw new BadRequestException(`Todo ${title} already exists`);
//       }
//     }
//   }
   
// }
