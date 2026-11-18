export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    stateless: true,
    webhookPath: "/api/telegram",
  });
}
