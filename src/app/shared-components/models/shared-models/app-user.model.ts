export class AppUserModel {
  fullName: string;
  lang: string;
  blocked: boolean;
  lastLogin: string;
  userAccessLevel: number;
  countDownSeconds: number;
  authToken: string;
  userAttributes: {
    HR_MODULES__APP: {
      appUserId: string;
      attributeKey: string;
      attributeValue: string;
      id: string;
    };
  };
  pictureSrc: string;
  id: string;
  someLabel: string;
}
