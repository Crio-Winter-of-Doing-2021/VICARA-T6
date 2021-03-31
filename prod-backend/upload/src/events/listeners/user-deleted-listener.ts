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
        const filesToDelete = await File.find({
            ownerId: id,
            isDirectory: false
        });
        const storage = StorageFactory.getStorage(StorageTypes.S3);
        filesToDelete.forEach(file => {
            storage.deleteFile(file._id.toHexString());
        });

        await File.deleteMany({
            ownerId: id
        });

        msg.ack();
    }
}
