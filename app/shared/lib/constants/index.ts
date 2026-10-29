export enum Role {
  SUPER_ADMIN = 'super_admin',
  USER = 'user',
  TEAM_MEMBER = 'team_member',
  SUPER_CLINIC_ADMIN = 'super_clinic_admin',
  CLINIC_ADMIN = 'clinic_admin',
  PRACTITIONER = 'practitioner',
  CLIENT = 'client',
  PHARMACY = 'pharmacy',
  PATIENT = 'patient',
  PROVIDER = 'provider',
}

export enum UserStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  REJECTED = 'rejected',
}
