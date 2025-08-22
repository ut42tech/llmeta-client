import { create } from "zustand";

type Results = any; // Mediapipe Holistic の結果。厳密な型が不要なため any とする

type VideoRecognitionState = {
  videoElement: HTMLVideoElement | null;
  setVideoElement: (videoElement: HTMLVideoElement | null) => void;
  resultsCallback: ((results: Results) => void) | null;
  setResultsCallback: (
    resultsCallback: ((results: Results) => void) | null
  ) => void;
};

export const useVideoRecognition = create<VideoRecognitionState>((set) => ({
  videoElement: null,
  setVideoElement: (videoElement) => set({ videoElement }),
  resultsCallback: null,
  setResultsCallback: (resultsCallback) => set({ resultsCallback }),
}));
