// app/room/[roomid]/page.tsx
import { notFound } from "next/navigation";
import Room from "./Room";

const Page = async ({ params }: { params: Promise<{ roomid: string }> }) => {
  const resolvedParams = await params;
  const roomId = resolvedParams.roomid;

  if (!roomId) {
    notFound();
  }

  return <Room roomId={roomId} />;
};

export default Page;
