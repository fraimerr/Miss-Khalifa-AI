import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({
  apiKey: "sk_b6c9036f32ff1483778f567f9600e7f54f20be7d4655b038",
});

export const createAudioStreamFromText = async (
  text: string
): Promise<Buffer> => {
  const audioStream = await client.generate({
    voice: "Rachel",
    model_id: "eleven_turbo_v2_5",
    text,
  });
  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }
  const content = Buffer.concat(chunks);
  return content;
};