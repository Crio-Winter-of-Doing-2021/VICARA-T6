import {File} from "../models/file.model";

export const getAvailableStorage = async (ownerId: string) => {
    const TOTAL_ALLOTTED_SIZE = 1024 * 1024 * 100;

    const fileExists = await File.findOne({
        ownerId,
        isDirectory: false
    });

    if (!fileExists) {
        return TOTAL_ALLOTTED_SIZE;
    }

    const totalUsedSize = await File.aggregate([
        {
            $match: {
                $and: [
                    {
                        ownerId,
                    },
                    {
                        isDirectory: false,
                    },
                ],
            },
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$fileSize",
                },
            },
        },
    ]);

    console.log('TOTAL_USED_SIZE_FN');
    console.log({totalUsedSize});
    console.log(TOTAL_ALLOTTED_SIZE - totalUsedSize?.[0]?.total ?? 0);
    return TOTAL_ALLOTTED_SIZE - totalUsedSize?.[0]?.total ?? 0;
}
