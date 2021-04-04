import {Publisher, Subjects, UserDeletedEvent} from '@vic-common/common';

export class UserDeletedPublisher extends Publisher<UserDeletedEvent> {
    readonly subject: Subjects.UserDeleted = Subjects.UserDeleted;
}