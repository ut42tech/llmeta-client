"use client";

import { useVideoRecognition } from "@/hooks/useVideoRecognition";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    // camera_utils
    Camera: any;
    // drawing_utils
    drawConnectors: any;
    drawLandmarks: any;
    // holistic
    Holistic: any;
    POSE_CONNECTIONS: any;
    HAND_CONNECTIONS: any;
    FACEMESH_TESSELATION: any;
  }
}

export const CameraWidget = () => {
  const [start, setStart] = useState(false);
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const drawCanvas = useRef<HTMLCanvasElement | null>(null);
  const setVideoElement = useVideoRecognition((state) => state.setVideoElement);

  // 動的にMediapipeのスクリプトを読み込む
  const loadScript = (src: string) =>
    new Promise<void>((resolve, reject) => {
      if (typeof window === "undefined") return resolve();
      // 既に読み込み済みならスキップ
      const found = Array.from(document.getElementsByTagName("script")).some(
        (s) => s.src === src
      );
      if (found) return resolve();
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });

  useEffect(() => {
    if (!start) {
      setVideoElement(null);
      return;
    }
    if ((useVideoRecognition.getState() as any).videoElement) {
      return;
    }
    let canceled = false;
    const run = async () => {
      if (typeof window === "undefined") return;
      // CDNから読み込み（バージョンを固定）
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1675466862/camera_utils.js"
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3.1675466124/drawing_utils.js"
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/holistic.js"
      );
      if (canceled) return;

      const {
        Camera,
        drawConnectors,
        drawLandmarks,
        Holistic,
        POSE_CONNECTIONS,
        HAND_CONNECTIONS,
        FACEMESH_TESSELATION,
      } = window as any;

      setVideoElement(videoElement.current);

      const holistic = new Holistic({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/${file}`;
        },
      });
      holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
        refineFaceLandmarks: true,
      });

      const drawResults = (results: any) => {
        if (!drawCanvas.current || !videoElement.current) return;
        drawCanvas.current.width = videoElement.current.videoWidth;
        drawCanvas.current.height = videoElement.current.videoHeight;
        const canvasCtx = drawCanvas.current.getContext("2d");
        if (!canvasCtx) return;
        canvasCtx.save();
        canvasCtx.clearRect(
          0,
          0,
          drawCanvas.current.width,
          drawCanvas.current.height
        );
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: "#00cff7",
          lineWidth: 4,
        });
        drawLandmarks(canvasCtx, results.poseLandmarks, {
          color: "#ff0364",
          lineWidth: 2,
        });
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
          color: "#C0C0C070",
          lineWidth: 1,
        });
        if (results.faceLandmarks && results.faceLandmarks.length === 478) {
          drawLandmarks(
            canvasCtx,
            [results.faceLandmarks[468], results.faceLandmarks[473]],
            {
              color: "#ffe603",
              lineWidth: 2,
            }
          );
        }
        drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
          color: "#eb1064",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, results.leftHandLandmarks, {
          color: "#00cff7",
          lineWidth: 2,
        });
        drawConnectors(
          canvasCtx,
          results.rightHandLandmarks,
          HAND_CONNECTIONS,
          {
            color: "#22c3e3",
            lineWidth: 5,
          }
        );
        drawLandmarks(canvasCtx, results.rightHandLandmarks, {
          color: "#ff0364",
          lineWidth: 2,
        });
      };

      holistic.onResults((results: any) => {
        drawResults(results);
        (useVideoRecognition.getState() as any).resultsCallback?.(results);
      });

      const camera = new Camera(videoElement.current as HTMLVideoElement, {
        onFrame: async () => {
          await holistic.send({
            image: videoElement.current as HTMLVideoElement,
          });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    };
    run();

    return () => {
      canceled = true;
    };
  }, [start]);

  return (
    <>
      <button
        onClick={() => setStart((prev) => !prev)}
        className={`fixed bottom-4 right-4 cursor-pointer ${
          start
            ? "bg-red-500 hover:bg-red-700"
            : "bg-indigo-400 hover:bg-indigo-700"
        } transition-colors duration-200 flex items-center justify-center z-20 p-4 rounded-full text-white drop-shadow-sm`}
      >
        {!start ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"
            />
          </svg>
        )}
      </button>
      <div
        className={`absolute z-[999999] bottom-24 right-4 w-[320px] h-[240px] rounded-[20px] overflow-hidden ${
          !start ? "hidden" : ""
        }`}
      >
        <canvas
          ref={drawCanvas}
          className="absolute z-10 w-full h-full bg-black/50 top-0 left-0"
        />
        <video
          ref={videoElement}
          className="absolute z-0 w-full h-full top-0 left-0"
        />
      </div>
    </>
  );
};
