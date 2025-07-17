/**
 * Tailwind 등으로 className이 길어질 경우,
 * inline-string이 아닌 string[]으로 입력하여
 * prettier가 개행시킬 수 있도록 도와주는 훅
 *
 * @param args ClassName Args
 * @returns {string}
 */
const c = (
  ...args: Array<string | undefined | boolean | Record<string, boolean>>
): string =>
  args
    .map((arg) => (arg instanceof Object ? filterObj(arg) : arg))
    .filter((arg) => !!arg)
    .join(" ");

export default c;

const filterObj = (arg: object) =>
  Object.entries(arg)
    .filter(([_, v]) => !!v)
    .map(([k, _]) => k);
