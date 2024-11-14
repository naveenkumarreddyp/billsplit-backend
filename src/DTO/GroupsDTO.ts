import { userInfo } from "../Entity/GroupsEntity";

export interface GroupsDTO {
  groupName: string;
  groupUsers: userInfo[];
}
