"use client";

import useUser from "@/hooks/useUser";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import React, { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";

const Room = ({ params }: { params: { roomid: string } }) => {
  const { fullName } = useUser();
  const roomId = params.roomid; //ignore error

  const meetingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const myMeeting = async (element: HTMLDivElement) => {
      // Generate Kit Token
      const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        uuid(),
        fullName || "user" + Date.now(),
        36000
      );

      // Create instance object from Kit Token
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      // Start the call
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Shareable link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomId,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
      });
    };

    if (meetingRef.current) {
      myMeeting(meetingRef.current); // Call myMeeting with the ref
    }
  }, [roomId, fullName]); // Dependencies for useEffect

  return (
    <div className="overflow-x-hidden flex flex-col items-center justify-center">
      <div
        className="w-full h-full"
        ref={meetingRef} // Attach the ref to the div
        style={{ width: "100vw", height: "80vh" }}
      ></div>
    </div>
  );
};

export default Room;
