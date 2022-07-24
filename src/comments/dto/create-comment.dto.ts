import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({
    example: "TestUserId",
    description: "댓글 작성한 유저의 id입니다.",
    required: true,
  })
  target_user_id: string;

  @ApiProperty({
    example: "1",
    description: "댓글 작성한 토론의 id입니다.",
    required: true,
  })
  target_debate_id: number;

  @ApiProperty({
    example: "true",
    description: "해당 댓글의 찬성, 반대측 값 입니다.",
    required: false,
  })
  pros: boolean;

  @ApiProperty({
    example: "testContents",
    description: "해당 댓글의 내용입니다.",
    required: true,
  })
  contents: string;
}
