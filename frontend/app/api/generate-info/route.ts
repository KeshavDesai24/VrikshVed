import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { diagnosis, language } = await request.json();
    if (!diagnosis)
      return NextResponse.json(
        { error: "Diagnosis text is required" },
        { status: 400 }
      );

    const prompt = `
    You are a senior plant pathologist with 20 years of experience.
    Generate a detailed and well-structured plant disease report for the following diagnosis: "${diagnosis}".
    Write the report entirely in ${language}.
    Follow this structure:

    **## Disease Overview**
    [Scientific name, severity, characteristics]

    **## Visual Symptoms**
    [Visible signs and stages]

    **## Disease Cycle**
    [Pathogen life cycle and favorable conditions]

    **## Risk Analysis**
    [Geographical, seasonal, and varietal risks]

    **## Prevention Plan**
    [Cultural practices and resistant varieties]

    **## Treatment Protocol**
    [Organic, Biological, Chemical approaches]

    **## Monitoring Guide**
    [Checklist for tracking progress]

    **## Fertilizers and Pesticides**
    [2–3 suggestions relevant to disease]

    Ensure the entire output is clearly written for farmers in ${language}.
    Use markdown formatting with emojis and simple words.
    Include metric and imperial units if needed.
    `;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API request failed");
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No report generated.";

    return NextResponse.json({ info: text });
  } catch (error) {
    console.error("Error in generate-info:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to generate disease info";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
