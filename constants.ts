import { FamilyMember } from './types';

export const INITIAL_DATA: FamilyMember = {
  id: 'root-1',
  name: '李建国',
  gender: 'male',
  birthDate: '1945',
  birthPlace: '江苏苏州',
  occupation: '纺织厂厂长',
  partner: '王秀英',
  photoUrl: 'https://picsum.photos/200/200?random=1',
  children: [
    {
      id: 'child-1',
      name: '李明',
      gender: 'male',
      birthDate: '1970',
      birthPlace: '上海',
      occupation: '工程师',
      partner: '张敏',
      photoUrl: 'https://picsum.photos/200/200?random=2',
      children: [
         {
          id: 'grandchild-1',
          name: '李华',
          gender: 'male',
          birthDate: '1998',
          birthPlace: '上海',
          occupation: '学生',
          photoUrl: 'https://picsum.photos/200/200?random=4',
          children: []
        }
      ]
    },
    {
      id: 'child-2',
      name: '李丽',
      gender: 'female',
      birthDate: '1975',
      birthPlace: '上海',
      occupation: '医生',
      partner: '赵强',
      photoUrl: 'https://picsum.photos/200/200?random=3',
      children: []
    }
  ]
};