/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import useUser from "@/hooks/useUser";

const Room = ({ roomId }: { roomId: string }) => {
  const { fullName } = useUser();
  const meetingRef = useRef<HTMLDivElement | null>(null);
  const isJoinedRef = useRef(false);

  useEffect(() => {
    let zp: any = null;

    const myMeeting = async (element: HTMLDivElement) => {
      if (isJoinedRef.current) return;

      const { ZegoUIKitPrebuilt } = await import(
        "@zegocloud/zego-uikit-prebuilt"
      );
      const appID = 621664069;
      const serverSecret = "71c223f135fe142eac8775f035b93364";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        uuid(),
        fullName || "user" + Date.now(),
        36000
      );

      zp = ZegoUIKitPrebuilt.create(kitToken);
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

      isJoinedRef.current = true;
    };

    if (meetingRef.current && !isJoinedRef.current) {
      myMeeting(meetingRef.current);
    }

    return () => {
      if (zp) {
        zp.destroy();
      }
    };
  }, [roomId, fullName]);
  return (
    <div className="overflow-x-hidden flex flex-col items-center justify-center">
      <div
        className="w-full h-full"
        ref={meetingRef}
        style={{ width: "100vw", height: "80vh" }}
      ></div>
    </div>
  );
};

export default Room;
