import {File} from "../models/file.model";

export const getAvailableStorage = async (ownerId: string) => {
    const TOTAL_ALLOTTED_SIZE = 1024 * 1024 * 100;
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
    return TOTAL_ALLOTTED_SIZE - totalUsedSize?.[0]?.total ?? 0;
}
