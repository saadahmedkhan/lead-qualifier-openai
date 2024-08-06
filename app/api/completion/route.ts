import { generateObject, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request)
{
    const { email, message }: { email: string, message: string } = await req.json();

    const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: z.object({
            result: z.boolean(),
            reason: z.string()
        }),
        messages: [
            {
                "role": "system",
                "content": `You will be provided with an email and a message from lead generation form submission from a website where user has potential shown their interest in following services provided by DP World, and your task is to classify the enquiry (the form submission) as 'qualified', or 'unqualified'.
                The qualification will also depend on if the provided email address is a corporate email address and not gmail.com, icloud.com, live.com, yahoo.com etc. If the email is qualified then analyze the message and qualify the lead.
                The types of services DP World offers include Logistics, Freight Forwarding, Terminals and Cargoes services.
                Give structured response as json like: { result: true|false, reason: string } where result is if qualification is true or false and reason with explanation.`
            },
            {
                role: "user",
                content: `Email: ${email}, Message: ${message}`
            }
        ]
    });

    //return result.toDataStreamResponse();

    return Response.json({ ...object })
}