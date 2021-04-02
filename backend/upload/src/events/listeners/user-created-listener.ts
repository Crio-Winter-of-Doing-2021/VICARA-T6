import {Message} from 'node-nats-streaming';
import {Subjects, Listener, UserCreatedEvent} from '@vic-common/common';
import {File} from '../../models/file.model';
import {queueGroupName} from "./queue-group-name";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
    subject: Subjects.UserCreated = Subjects.UserCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: UserCreatedEvent["data"], msg: Message) {
        const {id} = data;

        const RootDir = File.buildDir({
            fileName: 'root',
            isDirectory: true,
            parentId: id,
            ownerId: id
        });

        await RootDir.save();

        msg.ack();
    }
}