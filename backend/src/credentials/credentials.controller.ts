import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  createCredentialSchema,
  type CreateCredentialDto,
} from './dto/create-credential.dto';
import { CredentialsService } from './credentials.service';
import { ZodValidationPipe } from './validation.pipe';

@Controller('credentials')
export class CredentialsController {
  constructor(private credentialsService: CredentialsService) {}

  @Get()
  getAll() {
    return this.credentialsService.getAll();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createCredentialSchema))
  async issue(@Body() createCredentialDto: CreateCredentialDto) {
    return this.credentialsService.issue(createCredentialDto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    const credential = this.credentialsService.get(id);

    if (!credential) throw new NotFoundException();

    return credential;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.credentialsService.delete(id);
  }
}
