import { Controller, Post, HttpStatus, Param, Query, Get, Patch, Body,
  HttpException } from '@nestjs/common';
import { NodeService } from './node.service';
import { CreateNodeDTO, UpdateNodeDTO, ListNodeDTO, nodeOrderByParams } from './node.dtos';
import { OrderByPipe } from '../common/orderBy/orderBy.pipe';

@Controller()
export class NodeController {
  constructor(private readonly nodeService: NodeService) { }


  @Get('/nodes')
  async List( @Query(new OrderByPipe(nodeOrderByParams)) query:ListNodeDTO ) {
    return await this.nodeService.List(query)
    .then(res => res.docs)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Get('/node/:node_id')
  async GetById( @Param('node_id') node_id) {
    return await this.nodeService.GetById(node_id)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Post('/nodes')
  async Create( @Body() createNodeDTO:CreateNodeDTO ) {
    return await this.nodeService.Create(createNodeDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Patch('/node/:node_id')
  async Update( @Param('node_id') node_id, @Body() updateNodeDTO:UpdateNodeDTO) {
    return await this.nodeService.Update(node_id, updateNodeDTO)
    .catch(err => {
      throw new HttpException({
        error: err
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Patch('/node/:node_id/collaborators/add/:collaborator_id')
  async AddCollaborator(
    @Param('node_id') node_id,
    @Param('collaborator_id') collaborator_id)
    {
    return null; //TODO
  }

  @Patch('/node/:node_id/collaborators/remove/:collaborator_id')
  async RemoveCollaborator(
    @Param('node_id') node_id,
    @Param('collaborator_id') collaborator_id)
    {
    return null; //TODO
  }


}
