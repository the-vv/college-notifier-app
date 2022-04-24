import { ECustomUserRoles, ENotificationType, ERequestStatus, ESourceTargetType, EUserRoles } from './common.enum';

export interface ISource {
    college?: string | ICollege;
    department?: string | IDepartment;
    batch?: string | IBatch;
    class?: string | IClass;
    room?: string | IRoom;
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
    start: Date | string;
    end?: Date | string;
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password?: string;
    role: EUserRoles;
    customRoles?: ECustomUserRoles[];
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
export interface IRoom {
    _id?: string;
    name: string;
    description?: string;
    source: ISource;
    image?: string;
    active: boolean;
    admins: string[] | IUser[];
    createdAt: Date;
    createdBy: string | IUser;
    private: boolean;
}


export interface IEmailPassword {
    email: string;
    password: string;
}

export interface IUserMap {
    _id?: string;
    user: string | IUser;
    source: ISource;
}

export interface ITarget {
    college?: string;
    departments?: string[] | IDepartment[];
    batches?: string[] | IBatch[];
    classes?: string[] | IClass[];
    rooms?: string[] | IRoom[];
    users?: string[] | IUser[];
}

export interface INotification {
    _id?: string;
    title: string;
    content: string;
    attachment?: string;
    createdBy: string | IUser;
    createdAt: string;
    target: ITarget;
    type: ENotificationType;
    active: boolean;
}

export interface IForm {
    _id?: string;
    title: string;
    createdBy: IUser | string;
    createdAt: string | Date;
    target: ITarget;
    active: boolean;
    formData: string;
}

export interface IFormSubmission {
    _id?: string;
    form: IForm | string;
    user: string | IUser;
    data: string;
    createdAt: Date | string;
}

export interface IResource {
    _id?: string;
    name: string;
    description?: string;
    image?: string;
    college: string | ICollege;
    active: boolean;
}

export interface IResourceSchedule {
    _id?: string;
    createdBy: string | IUser;
    createdAt: Date | string;
    description: string;
    college: string | ICollege;
    resource: string | IResource;
    schedule: ISchedule;
}

export interface ITimeTable {
    _id?: string;
    class: string | IClass;
    college: string | ICollege;
    department: string | IDepartment;
    hoursCount: number;
    schedule: ISchedule;
    allocation?: {
        [hour: number]: string; // hour: tutorId
    };
}
