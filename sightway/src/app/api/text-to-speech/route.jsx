const { NextResponse } = require("next/server");

export async function POST(request) {
  const { text, language_code } = await request.json();
  
    try {
        const response = await fetch("http://127.0.0.1:5000/text-to-speech", {
            method: "POST",
            body: JSON.stringify({ text, language_code }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: "An error occurred" }, { status: 500 });
        }

        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}