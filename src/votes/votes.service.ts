import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";
import { Repository } from "typeorm";
import { CreateVoteDto } from "./dto/create-vote.dto";
import { GetVoteCountResponseDto } from "./dto/get-vote-count-response.dto";
import { IsVotedResponseDto } from "./dto/is-voted-response.dto";
import { IsVotedDto } from "./dto/is-voted.dto";
import { VoteEntity } from "./entity/vote.entity";

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(VoteEntity)
    private voteRepository: Repository<VoteEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DebateEntity)
    private debateRepository: Repository<DebateEntity>,
  ) {}

  async createVote(dto: CreateVoteDto) {
    const target_user = await this.userRepository.findOne({
      id: dto.target_user_id,
    });
    const target_debate = await this.debateRepository.findOne({
      id: dto.target_debate_id,
    });

    const exist = await this.voteRepository.findOne({
      where: {
        target_user: target_user,
        target_debate: target_debate,
      },
    });

    if (!exist) {
      const vote = new VoteEntity();
      vote.target_user = target_user;
      vote.target_debate = target_debate;
      vote.pros = dto.pros;

      await this.voteRepository.save(vote);
    } else {
      throw new HttpException("Already Exist", HttpStatus.BAD_REQUEST);
    }
  }

  async getVoteCount(debateId: number): Promise<GetVoteCountResponseDto> {
    const pros_count = await this.voteRepository.count({
      where: {
        target_debate: debateId,
        pros: true,
      },
    });
    const cons_count = await this.voteRepository.count({
      where: {
        target_debate: debateId,
        pros: false,
      },
    });
    return { pros_count, cons_count };
  }

  async updateVote(dto: CreateVoteDto) {
    const target_user = await this.userRepository.findOne({
      id: dto.target_user_id,
    });
    const target_debate = await this.debateRepository.findOne({
      id: dto.target_debate_id,
    });

    await this.voteRepository.update(
      { target_user: target_user, target_debate: target_debate },
      {
        pros: dto.pros,
      },
    );
  }

  async deleteVote(voteId: number) {
    const vote = await this.voteRepository.findOne({
      where: { id: voteId },
      relations: ["target_debate"],
    });
    const result = vote.target_debate.id;
    await this.voteRepository.delete({ id: voteId });
    return result;
  }

  async isVoted(dto: IsVotedDto): Promise<IsVotedResponseDto> {
    const vote = await this.voteRepository.findOne({
      where: {
        target_user: dto.target_user_id,
        target_debate: dto.target_debate_id,
      },
    });

    let isVote = false;
    let pros = false;

    if (!vote) {
      isVote = false;
      pros = false;
    } else {
      isVote = true;
      pros = vote.pros;
    }

    return { isVote, pros };
  }
}
