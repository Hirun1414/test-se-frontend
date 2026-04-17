export default async function userLogIn(userEmail:string, userPassword:string) {
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: userEmail,
            password: userPassword
        }),
    })

    if(!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to Log-In")
    }
    return await response.json();
}
