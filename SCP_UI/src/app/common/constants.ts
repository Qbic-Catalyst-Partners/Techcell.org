export const PASSWORD_PATTERN = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$';
export const EMAIL_PATTERN = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
export const MOBILE_PATTERN = '^((\\+91-?)|0)?[0-9]{10}$';
export const File_Size_1 = 1048576;
export const File_Size_5 = 1048576 * 5;
export const File_Type_Accepted = 'image/png,image/jpeg,image/jpg';
export const File_Type_Accepted_Extra = 'image/png,image/jpeg,image/jpg,application/pdf,application/msword'

export const GENDER_LIST = [
    { genderName: 'Male' },
    { genderName: 'Female' },
    { genderName: 'Others' },
  ];

  export const STUDENT_ROLE = 'Student';
  export const COMMUNITY_ROLE = 'Moderator';
  export const FACULITY_ROLE = 'Faculty';
  export const ADMIN_ROLE = 'Admin';
  export const CORPORATE_ROLE = 'Corporate';