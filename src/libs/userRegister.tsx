export default async function userRegister(name: string, tel: string, email: string, password: string, role: string = "user") {
    const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tel, email, password, role }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "สมัครสมาชิกไม่สำเร็จ");
    }

    return data;
}
