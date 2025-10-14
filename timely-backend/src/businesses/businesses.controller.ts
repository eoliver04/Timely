import { Body, Controller, Post, Req, UseGuards,UnauthorizedException, Get, Param, Patch, Delete } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesGuard } from './businesses.guard';
import { CreateBusinessDTO, UpdateBusinessDTO } from './dto/businesses.dto';
import { AdminBusinessGuard } from './checkOwner.guard';
import { AdminAccessGuard } from './adminAccess.guard';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  //crear un negocio
    @UseGuards(BusinessesGuard)
    @Post()
    async createBusines(@Req()req,@Body() createBusiness:CreateBusinessDTO ){
      const ownerId=req.user.id;
      if(req.user.role!=='admin'){
        throw new UnauthorizedException('Only admins can create a business');
      }
      return this.businessesService.createBusiness(createBusiness,ownerId);
    }
    //retorna una lista con todos los negocios
    @UseGuards(BusinessesGuard)
    @Get()
    async getAllBusinesses(){
      return this.businessesService.getAllBusinesses();
    }
    //retorna un negocio por un id
    @UseGuards(BusinessesGuard)
    @Get(':id')
    async getBussinesByid(@Param('id') id: string){
      return this.businessesService.getBussinesById(id);
    }
    //para update business
    @UseGuards(BusinessesGuard,AdminBusinessGuard)
    @Patch(':id')
    async updateBusiness(@Param('id') businessId: string, @Body()updateData:UpdateBusinessDTO,@Req()req){
      const ownerId=req.user.id;
      if(req.user.role!=='admin'){
        throw new UnauthorizedException('Only admins can update a business');
      }
      return this.businessesService.updateBusiness(businessId, updateData);
    }
    //retornar negocios de un usuario
    @UseGuards(BusinessesGuard,AdminAccessGuard)
    @Get('admin/:adminId')
    async getBusinessesByAdmin(@Param('adminId') adminId:string,@Req()req){
      return this.businessesService.getBusinessesByAdmin(adminId);
    }

    //eliminar business
    @UseGuards(BusinessesGuard,AdminBusinessGuard)
    @Delete(':id')
    async deleteBusiness(@Param('id')id:string,@Req()req){
      if(req.user.role !=='admin'){
        throw new UnauthorizedException('Only admins can delete a business');
      }
      return this.businessesService.deleteBusiness(id);
    }
}
