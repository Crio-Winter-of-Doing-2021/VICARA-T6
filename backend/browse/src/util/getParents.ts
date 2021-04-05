import { File, FileDoc } from "../models/file.model";

interface ancestorSchema {
  id: string;
  fileName: string;
}

export const getAncestors = async (
  ownerId: string,
  parentId: string
): Promise<ancestorSchema[]> => {
  let parent = parentId;
  const ancestors: ancestorSchema[] = [];
  let leafFileDetails = await File.findById(parentId);

  if (leafFileDetails) {
    const { id, fileName } = leafFileDetails;

    if (fileName && id) {
      ancestors.push({
        id,
        fileName,
      });
    }

    //Update the parent of folder
    parent = leafFileDetails?.parentId;

    //Find till the root parent is found
    while (leafFileDetails?.parentId !== leafFileDetails?.ownerId) {
      leafFileDetails = await File.findById(parent);

      if (leafFileDetails) {
        const { id, fileName } = leafFileDetails;

        if (fileName && id) {
          ancestors.push({
            id,
            fileName,
          });
        }

        parent = leafFileDetails?.parentId;
      }
    }

    ancestors.push({
      id: parent,
      fileName: "Home",
    });
  }

  return ancestors;
};
