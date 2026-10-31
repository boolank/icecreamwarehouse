import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from "@nestjs/common";
import { OpnameService } from "./opname.service";
import { CreateOpnameDto } from "./dto/create-opname.dto";
import { SubmitCountDto } from "./dto/submit-count.dto";

@Controller("api/v1/opname")
export class OpnameController {
  constructor(private readonly opnameService: OpnameService) {}

  @Post()
  async createOpname(@Body() dto: CreateOpnameDto) {
    return this.opnameService.createOpname(dto);
  }

  @Get()
  async findAll() {
    return this.opnameService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.opnameService.findOne(id);
  }

  @Patch(":id/count")
  async submitCount(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: SubmitCountDto
  ) {
    return this.opnameService.submitCount(id, dto);
  }

  @Patch(":id/approve")
  async approveAndPost(@Param("id", ParseIntPipe) id: number) {
    return this.opnameService.approveAndPost(id);
  }
}

