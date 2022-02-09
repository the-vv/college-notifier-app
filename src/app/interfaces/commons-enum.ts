export enum EUserRoles {
    admin = 'admin',
    student = 'student',
    tutor = 'tutor',
    parent = 'parent',
    faculty = 'faculty',
    custom = 'custom',
    superAdmin = 'superAdmin',
}

export enum ERequestStatus {
    pending = 'pending',
    rejected = 'rejected',
    active = 'active',
    inactive = 'inactive',
}

export enum ESourceTargetType {
    college = 'college',
    department = 'department',
    batch = 'batch',
    class = 'class',
    room = 'room',
}

export enum ENotificationType {
    notification = 'notification',
    event = 'event',
}
