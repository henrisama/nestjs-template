export interface IAutoEndpoints {
  findAll?: boolean;
  findOneById?: boolean;
  findOneByProperty?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  softdelete?: boolean;
  restore?: boolean;
}
