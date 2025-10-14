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
      const authHeader = req.headers.authorization;
      if(req.user.role!=='admin'){
        throw new UnauthorizedException('Only admins can create a business');
      }
      return this.businessesService.createBusiness(createBusiness,ownerId, authHeader);
    }
    //retorna una lista con todos los negocios
    @UseGuards(BusinessesGuard)
    @Get()
    async getAllBusinesses(@Req() req: any){
      console.log('🎯 [Controller] getAllBusinesses iniciado');
      console.log('🎯 [Controller] Usuario en request:', req.user);
      
      const authHeader = req.headers.authorization;
      console.log('🎯 [Controller] authHeader:', authHeader ? `Bearer ${authHeader.split(' ')[1]?.substring(0, 20)}...` : 'No header');
      
      const result = await this.businessesService.getAllBusinesses(authHeader);
      console.log('🎯 [Controller] Resultado del service:', result);
      
      return result;
    }
    //retorna un negocio por un id
    @UseGuards(BusinessesGuard)
    @Get(':id')
    async getBussinesByid(@Param('id') id: string, @Req() req: any){
      const authHeader = req.headers.authorization;
      return this.businessesService.getBussinesById(id, authHeader);
    }
    //para update business
    @UseGuards(BusinessesGuard,AdminBusinessGuard)
    @Patch(':id')
    async updateBusiness(@Param('id') businessId: string, @Body()updateData:UpdateBusinessDTO,@Req()req){
      const ownerId=req.user.id;
      const authHeader = req.headers.authorization;
      if(req.user.role!=='admin'){
        throw new UnauthorizedException('Only admins can update a business');
      }
      return this.businessesService.updateBusiness(businessId, updateData, authHeader);
    }
    //retornar negocios de un usuario
    @UseGuards(BusinessesGuard,AdminAccessGuard)
    @Get('admin/:adminId')
    async getBusinessesByAdmin(@Param('adminId') adminId:string,@Req()req){
      const authHeader = req.headers.authorization;
      return this.businessesService.getBusinessesByAdmin(adminId, authHeader);
    }

    //eliminar business
    @UseGuards(BusinessesGuard,AdminBusinessGuard)
    @Delete(':id')
    async deleteBusiness(@Param('id')id:string,@Req()req){
      const authHeader = req.headers.authorization;
      if(req.user.role !=='admin'){
        throw new UnauthorizedException('Only admins can delete a business');
      }
      return this.businessesService.deleteBusiness(id, authHeader);
    }
}
