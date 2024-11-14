export interface UserEntity {
  userId: string;
  userName: string;
  userEmail: string;
  password: string;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: string;
  updatedBy: string | null;
  isActive: number; // new field added for user status
  forgetPassword?: string | null;
  forgetPasswordExpiry?: string | null;
}

// export class UserEntity {
//   public userid!: string;
//   public name!: string;
//   public email!: string;
//   public password!: string;
//   public createdAt!: Date;
//   public updatedAt!: Date | null;
//   public createdBy!: string;
//   public updatedBy!: string | null;
//   isActive
// }
