export function verifyAdminAuth(password: string): boolean {
    const expected = process.env.ADMIN_PASSWORD ?? "sporty";
    return password === expected;
}
