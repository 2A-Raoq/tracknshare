import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1782672862490 implements MigrationInterface {
  name = 'Init1782672862490'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying NOT NULL, "passwordHash" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'PLAYER', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`CREATE INDEX "idx_user_username" ON "users" ("username") `)
    await queryRunner.query(
      `CREATE TABLE "team_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" uuid NOT NULL, "userId" uuid NOT NULL, "role" character varying NOT NULL DEFAULT 'MEMBER', "joinedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b2f17b533905e0a94390c5e2208" UNIQUE ("teamId", "userId"), CONSTRAINT "PK_ca3eae89dcf20c9fd95bf7460aa" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "chat_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" uuid NOT NULL, "senderId" uuid NOT NULL, "content" text, "encryptedContent" text, "iv" character varying(64), "authTag" character varying(64), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tag" character varying(10) NOT NULL, "description" text, "ownerId" character varying NOT NULL, "inviteCode" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_48c0c32e6247a2de155baeaf980" UNIQUE ("name"), CONSTRAINT "UQ_f2eda092e8b2bfd1aa6161175d8" UNIQUE ("inviteCode"), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "games" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "platform" character varying NOT NULL DEFAULT 'PC', "isTeamBased" boolean NOT NULL DEFAULT false, "apiProvider" character varying NOT NULL DEFAULT 'mock', "externalId" character varying(64), "imageUrl" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_095bbaa4f028fa5a03e37f631d6" UNIQUE ("slug"), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "seasons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "startDate" date NOT NULL, "endDate" date, "status" character varying NOT NULL DEFAULT 'ACTIVE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cb8ed53b5fe109dcd4a4449ec9d" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "player_stats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "gameId" uuid NOT NULL, "seasonId" uuid NOT NULL, "kills" integer NOT NULL DEFAULT '0', "deaths" integer NOT NULL DEFAULT '0', "wins" integer NOT NULL DEFAULT '0', "losses" integer NOT NULL DEFAULT '0', "matchesPlayed" integer NOT NULL DEFAULT '0', "playtimeMinutes" integer NOT NULL DEFAULT '0', "kdRatio" double precision NOT NULL DEFAULT '0', "winrate" integer NOT NULL DEFAULT '0', "score" integer NOT NULL DEFAULT '0', "provider" character varying NOT NULL DEFAULT 'MOCK', "fetchedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5daa7868b2932fa98cf984b8b08" UNIQUE ("userId", "gameId", "seasonId"), CONSTRAINT "PK_22e2d8ec820a98efbfdbf84d925" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "idx_leaderboard_query" ON "player_stats" ("gameId", "seasonId", "score") `,
    )
    await queryRunner.query(
      `CREATE TABLE "conversation_participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "conversationId" uuid NOT NULL, "userId" uuid NOT NULL, "lastReadAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e43efbfa3b850160b5b2c50e3ec" UNIQUE ("conversationId", "userId"), CONSTRAINT "PK_61b51428ad9453f5921369fbe94" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL DEFAULT 'DIRECT', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "private_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "conversationId" uuid NOT NULL, "senderId" uuid NOT NULL, "content" text, "encryptedContent" text, "iv" character varying(64), "authTag" character varying(64), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "editedAt" TIMESTAMP WITH TIME ZONE, "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_1bf7cc91ba0b17389d76f7ad2a4" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "steam_tracked_games" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "gameAccountId" character varying NOT NULL, "provider" character varying NOT NULL DEFAULT 'STEAM', "externalGameId" character varying(32) NOT NULL, "name" character varying(160) NOT NULL, "playtimeForever" integer NOT NULL DEFAULT '0', "playtime2Weeks" integer, "imageUrl" text, "isTracked" boolean NOT NULL DEFAULT false, "lastSeenAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_13b730ef2ebc790eb69d2d5d8cd" UNIQUE ("userId", "provider", "externalGameId"), CONSTRAINT "PK_ece6d4ab90c6b7dd06f1e3bce03" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "game_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "platform" character varying NOT NULL, "externalId" character varying NOT NULL, "externalUsername" character varying(120), "linkedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastSyncAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8a274d6a6fe36c58832fe1fe34f" UNIQUE ("platform", "externalId"), CONSTRAINT "UQ_e812d1b9b3e1e61b6452e451ccf" UNIQUE ("userId", "platform"), CONSTRAINT "PK_df01ce03c0e0d8d6fefc7de6423" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "friend_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderId" uuid NOT NULL, "recipientId" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "respondedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3827ba86ce64ecb4b90c92eeea6" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "achievements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "icon" character varying NOT NULL, "iconKey" character varying(50), "points" integer NOT NULL DEFAULT '0', "targetValue" integer NOT NULL DEFAULT '1', "category" character varying(50) NOT NULL DEFAULT 'GENERAL', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cd74882f69ff37d7330e89c63d5" UNIQUE ("code"), CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_achievements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "achievementId" uuid NOT NULL, "unlockedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c1acd69cf91b1e353634c152dd7" UNIQUE ("userId", "achievementId"), CONSTRAINT "PK_3d94aba7e9ed55365f68b5e77fa" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_6d1c8c7f705803f0711336a5c33" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_0a72b849753a046462b4c5a8ec2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_3a35ec020082bf1171cbb88d09a" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_fc6b58e41e9a871dacbe9077def" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "player_stats" ADD CONSTRAINT "FK_a14e90bda5a40cf0b150c6dc87f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "player_stats" ADD CONSTRAINT "FK_dda32e4af0ba81ca82ac5379578" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "player_stats" ADD CONSTRAINT "FK_e8ecfb1db35dff1acfac9533922" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" ADD CONSTRAINT "FK_4453e20858b14ab765a09ad728c" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" ADD CONSTRAINT "FK_18c4ba3b127461649e5f5039dbf" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "private_messages" ADD CONSTRAINT "FK_6c99f5465cc85de2563ebc6ed28" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "private_messages" ADD CONSTRAINT "FK_5938be33949ac6364947acbc832" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" ADD CONSTRAINT "FK_da724334b35796722ad87d31884" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" ADD CONSTRAINT "FK_b7d86ccee3c96b290cab3cbe3f1" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_achievements" ADD CONSTRAINT "FK_3ac6bc9da3e8a56f3f7082012dd" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_achievements" ADD CONSTRAINT "FK_6a5a5816f54d0044ba5f3dc2b74" FOREIGN KEY ("achievementId") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_achievements" DROP CONSTRAINT "FK_6a5a5816f54d0044ba5f3dc2b74"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_achievements" DROP CONSTRAINT "FK_3ac6bc9da3e8a56f3f7082012dd"`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" DROP CONSTRAINT "FK_b7d86ccee3c96b290cab3cbe3f1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" DROP CONSTRAINT "FK_da724334b35796722ad87d31884"`,
    )
    await queryRunner.query(
      `ALTER TABLE "private_messages" DROP CONSTRAINT "FK_5938be33949ac6364947acbc832"`,
    )
    await queryRunner.query(
      `ALTER TABLE "private_messages" DROP CONSTRAINT "FK_6c99f5465cc85de2563ebc6ed28"`,
    )
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" DROP CONSTRAINT "FK_18c4ba3b127461649e5f5039dbf"`,
    )
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" DROP CONSTRAINT "FK_4453e20858b14ab765a09ad728c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "player_stats" DROP CONSTRAINT "FK_e8ecfb1db35dff1acfac9533922"`,
    )
    await queryRunner.query(
      `ALTER TABLE "player_stats" DROP CONSTRAINT "FK_dda32e4af0ba81ca82ac5379578"`,
    )
    await queryRunner.query(
      `ALTER TABLE "player_stats" DROP CONSTRAINT "FK_a14e90bda5a40cf0b150c6dc87f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_fc6b58e41e9a871dacbe9077def"`,
    )
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_3a35ec020082bf1171cbb88d09a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_0a72b849753a046462b4c5a8ec2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_6d1c8c7f705803f0711336a5c33"`,
    )
    await queryRunner.query(`DROP TABLE "user_achievements"`)
    await queryRunner.query(`DROP TABLE "achievements"`)
    await queryRunner.query(`DROP TABLE "friend_requests"`)
    await queryRunner.query(`DROP TABLE "game_accounts"`)
    await queryRunner.query(`DROP TABLE "steam_tracked_games"`)
    await queryRunner.query(`DROP TABLE "private_messages"`)
    await queryRunner.query(`DROP TABLE "conversations"`)
    await queryRunner.query(`DROP TABLE "conversation_participants"`)
    await queryRunner.query(`DROP INDEX "public"."idx_leaderboard_query"`)
    await queryRunner.query(`DROP TABLE "player_stats"`)
    await queryRunner.query(`DROP TABLE "seasons"`)
    await queryRunner.query(`DROP TABLE "games"`)
    await queryRunner.query(`DROP TABLE "teams"`)
    await queryRunner.query(`DROP TABLE "chat_messages"`)
    await queryRunner.query(`DROP TABLE "team_members"`)
    await queryRunner.query(`DROP INDEX "public"."idx_user_username"`)
    await queryRunner.query(`DROP TABLE "users"`)
  }
}
