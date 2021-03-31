import {Publisher, Subjects, UserCreatedEvent} from '@vic-common/common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
    readonly subject: Subjects.UserCreated = Subjects.UserCreated;
}