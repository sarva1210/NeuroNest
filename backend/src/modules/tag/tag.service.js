import Tag from "./tag.model.js";

export const upsertTags = async (tags, userId) => {
  const result = [];

  for (const name of tags) {
    const tag = await Tag.findOneAndUpdate(
      { name: name.toLowerCase(), userId },
      { name: name.toLowerCase(), userId },
      { new: true, upsert: true }
    );

    result.push(tag);
  }

  return result;
};