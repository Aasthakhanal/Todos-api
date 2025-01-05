import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {  hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService     
  ){}

  async create(createUserDto: CreateUserDto) {
    await this.checkIfUserEmailExists(createUserDto.email);
    await this.checkIfUserMobileExists(createUserDto.mobile);  
    createUserDto.password = await hash(createUserDto.password, 10);
    
    return this.prismaService.user.create({data: createUserDto});
    
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: number) {
    return this.getUser(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.getUser(id);

    if(updateUserDto.email){
      await this.checkIfUserEmailExists(updateUserDto.email, id);
    }

    if(updateUserDto.mobile){
      await this.checkIfUserMobileExists(updateUserDto.mobile, id);
    }

    if (updateUserDto.password && user.password !== updateUserDto.password){
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }
    return this.prismaService.user.update({where: { id },data: updateUserDto,});
  }

  async remove(id: number) {
    await this.getUser(id);
    return this.prismaService.user.delete({where: {id}});

  }

  private async getUser(id: number) {
    const user = await this.prismaService.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }


  private async checkIfUserEmailExists(email: string, id?: number) {
    const doesUserEmailExist = await this.prismaService.user.findFirst({
      where: { email},
    });
    if (doesUserEmailExist) {
      if (id && doesUserEmailExist.id !== id) {
        //this is update case
        throw new BadRequestException(`Email ${email} already exists`);
      } else if (!id) {
        //this is create case
        throw new BadRequestException(`Email ${email} already exists`);
      }
    }
  }

  private async checkIfUserMobileExists(mobile: string, id?: number) {
    const doesUserMobileExist = await this.prismaService.user.findFirst({
      where: { mobile},
    });
    if (doesUserMobileExist) {
      if (id && doesUserMobileExist.id !== id) {
        //this is update case
        throw new BadRequestException(`Mobile ${mobile} already exists`);
      } else if (!id) {
        //this is create case
        throw new BadRequestException(`Mobile ${mobile} already exists`);
      }
    }
  }
}
