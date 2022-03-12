import { ERequestStatus, ESourceTargetType, EUserRoles } from './common.enum';

export interface ISource {
    college?: string;
    department?: string;
    batch?: string;
    class?: string;
    source: ESourceTargetType;
}

export interface ITarget {
    college?: string;
    department?: string;
    batch?: string;
    class?: string;
    target: ESourceTargetType;
}

export interface ISchedule {
    start: Date;
    end?: Date;
}

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    role: EUserRoles;
    active: boolean;
    image?: string;
}

export interface IDepartment {
    _id?: string;
    name: string;
    description?: string;
    source: ISource;
    image?: string;
    active: boolean;
    admins: string[] | IUser[];
}

export interface ICollege {
    _id: string;
    name: string;
    address: string;
    phone: string;
    website?: string;
    image?: string;
    status?: ERequestStatus;
    admins: string[] | IUser[];
}

export interface IBatch {
    _id?: string;
    startDate: Date;
    endDate: Date;
    active: boolean;
    source: ISource;
    image?: string;
    admins: string[] | IUser[];
}

export interface IClass {
    _id?: string;
    name: string;
    active: boolean;
    description?: string;
    source: ISource;
    image?: string;
    admins: string[] | IUser[];
}

export interface IEmailPassword {
    email: string;
    password: string;
}
