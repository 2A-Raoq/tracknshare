import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CreateConversationDto {
  @ApiProperty({
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
    description: "Identifiant de l'utilisateur destinataire",
  })
  @IsUUID()
  recipientId: string
}
