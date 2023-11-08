export type Message = {
  id: string;
  content: string;
  userId?: string;
  color?: string;
  username?: string;
};

export type MemberData = {
  id: string;
  color: string;
  username: string;
};
