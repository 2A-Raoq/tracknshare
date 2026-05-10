import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateFriendRequestDto } from './dto/create-friend-request.dto'
import { FriendsService } from './friends.service'

@ApiTags('friends')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @ApiOperation({ summary: 'List accepted friends of the current user' })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  async getFriends(@Req() req: any) {
    const data = await this.friendsService.listFriends(req.user.userId)
    return { success: true, data }
  }

  @Get('requests')
  @ApiOperation({ summary: 'List incoming and outgoing pending friend requests' })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  async getRequests(@Req() req: any) {
    const data = await this.friendsService.listPendingRequests(req.user.userId)
    return { success: true, data }
  }

  @Post('requests')
  @ApiOperation({ summary: 'Create a friend request' })
  @ApiBody({ type: CreateFriendRequestDto })
  @ApiBadRequestResponse({ description: 'Cannot send a request to self' })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  @ApiNotFoundResponse({ description: 'Recipient not found' })
  @ApiConflictResponse({ description: 'Request already pending or friendship already exists' })
  async createRequest(@Req() req: any, @Body() dto: CreateFriendRequestDto) {
    const data = await this.friendsService.createRequest(req.user.userId, dto.recipientId)
    return { success: true, data }
  }

  @Patch('requests/:requestId/accept')
  @ApiOperation({ summary: 'Accept an incoming friend request' })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  @ApiForbiddenResponse({ description: 'Only the recipient can accept' })
  @ApiNotFoundResponse({ description: 'Friend request not found' })
  @ApiConflictResponse({ description: 'Friend request is no longer pending' })
  async acceptRequest(@Req() req: any, @Param('requestId') requestId: string) {
    const data = await this.friendsService.acceptRequest(requestId, req.user.userId)
    return { success: true, data }
  }

  @Patch('requests/:requestId/refuse')
  @ApiOperation({ summary: 'Refuse an incoming friend request' })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  @ApiForbiddenResponse({ description: 'Only the recipient can refuse' })
  @ApiNotFoundResponse({ description: 'Friend request not found' })
  @ApiConflictResponse({ description: 'Friend request is no longer pending' })
  async refuseRequest(@Req() req: any, @Param('requestId') requestId: string) {
    const data = await this.friendsService.refuseRequest(requestId, req.user.userId)
    return { success: true, data }
  }

  @Patch('requests/:requestId/cancel')
  @ApiOperation({ summary: 'Cancel an outgoing pending friend request' })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  @ApiForbiddenResponse({ description: 'Only the sender can cancel' })
  @ApiNotFoundResponse({ description: 'Friend request not found' })
  @ApiConflictResponse({ description: 'Friend request is no longer pending' })
  async cancelRequest(@Req() req: any, @Param('requestId') requestId: string) {
    const data = await this.friendsService.cancelRequest(requestId, req.user.userId)
    return { success: true, data }
  }

  @Delete(':friendId')
  @ApiOperation({ summary: 'Remove a friend' })
  @ApiUnauthorizedResponse({ description: 'JWT missing or invalid' })
  @ApiNotFoundResponse({ description: 'Friendship not found' })
  async removeFriend(@Req() req: any, @Param('friendId') friendId: string) {
    const data = await this.friendsService.removeFriend(req.user.userId, friendId)
    return { success: true, data }
  }
}
