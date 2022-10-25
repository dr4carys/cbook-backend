export const stringToJson = async (arg: any) => {
  try {
    const data = await arg;
    console.log('data >>', data);
    return { response: data ? data.toJSON() : undefined };
  } catch (e) {
    console.log(e);
    return { error: e };
  }
};
