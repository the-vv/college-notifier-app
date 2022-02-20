export enum EUserRoles {
    admin = 'admin',
    student = 'student',
    tutor = 'tutor',
    parent = 'parent',
    faculty = 'faculty',
    custom = 'custom',
    superAdmin = 'super-admin',
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

export enum EBreakPoints {
    xs = 'xsmall',
    sm = 'small',
    md = 'medium',
    lg = 'large',
    xl = 'xlarge',
}

export enum EStorageKeys {
    user = 'user',
    college = 'college',
    token = 'token',
}

export enum ERedirectTo {
    createCollege = 'create-college',
    joinCollege = 'join-college',
    createDepartment = 'create-department',
    joinDepartment = 'join-department',
    createBatch = 'create-batch',
    joinBatch = 'join-batch',
    createClass = 'create-class',
    joinClass = 'join-class',
    createRoom = 'create-room',
    joinRoom = 'join-room'
}
