import {Message} from 'node-nats-streaming';

import {Listener, Subjects, UserDeletedEvent} from '@vic-common/common';
import {queueGroupName} from "./queue-group-name";
import {File} from '../../models/file.model';
import {StorageTypes} from "../../storage/Storage.model";
import {StorageFactory} from '../../storage/Storage.factory';

export class UserDeletedListener extends Listener<UserDeletedEvent> {
    subject: Subjects.UserDeleted = Subjects.UserDeleted;
    queueGroupName = queueGroupName;
    async onMessage(data: UserDeletedEvent["data"], msg: Message) {
        const {id} = data;
        const storage = StorageFactory.getStorage(StorageTypes.S3);
        storage.deleteFile('', id);
        await File.deleteMany({
            ownerId: id
        });

        msg.ack();
    }
}
