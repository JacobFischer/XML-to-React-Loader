import compile from "./webpack-compile";

test("Inserts name and outputs JavaScript", async () => {
    const stats = await compile("example.txt");

    const output = stats.toJson();
    const { modules } = output;

    expect(modules).toBeDefined();
    expect(modules && modules[0].source).toBe(`export default "Hey Alice!"`);
});
