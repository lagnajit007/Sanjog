"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Camera,
  CameraOff,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  AlertTriangle,
  Hand,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { useHandTracking } from "@/hooks/useHandTrackingFixed"
import { getRandomPrediction } from "@/utils/handGestureService"
import Head from "next/head"

// Browser detection utility
const getBrowserInfo = () => {
  if (typeof window === 'undefined' || !window.navigator) {
    return { name: 'unknown', version: 'unknown' };
  }
  
  const userAgent = navigator.userAgent;
  let browserName = 'unknown';
  let browserVersion = 'unknown';

  // Chrome
  if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    if (match) browserVersion = match[1];
  }
  // Firefox
  else if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    if (match) browserVersion = match[1];
  }
  // Safari
  else if (userAgent.indexOf('Safari') > -1) {
    browserName = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    if (match) browserVersion = match[1];
  }
  // Edge (Chromium-based)
  else if (userAgent.indexOf('Edg') > -1) {
    browserName = 'Edge';
    const match = userAgent.match(/Edg\/(\d+)/);
    if (match) browserVersion = match[1];
  }
  // IE
  else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
    browserName = 'Internet Explorer';
    const match = userAgent.match(/(?:MSIE |rv:)(\d+)/);
    if (match) browserVersion = match[1];
  }

  return { name: browserName, version: browserVersion };
};

// Get browser-specific camera instructions
const getBrowserSpecificInstructions = () => {
  const { name, version } = getBrowserInfo();
  
  if (name === 'Chrome') {
    return `For Chrome: Click the camera icon in the address bar and select "Allow" for camera access.`;
  } else if (name === 'Firefox') {
    return `For Firefox: Click the camera icon in the address bar and choose "Remember this decision" when allowing camera access.`;
  } else if (name === 'Safari') {
    return `For Safari: Go to Safari > Preferences > Websites > Camera and allow access for this site.`;
  } else if (name === 'Edge') {
    return `For Edge: Click the camera icon in the address bar and select "Allow" for camera access.`;
  }
  
  return `Check your browser settings to allow camera access for this site.`;
};

// Define the alphabet and number lessons
const ALPHABET_LESSONS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
const NUMBER_LESSONS = "0123456789".split("")

// Improved MediaPipe assets loading with better error handling
const loadMediaPipeAssets = () => {
  if (typeof window === 'undefined') return;
  
  // Add a global flag to prevent duplicate loading
  if (!(window as any).__mediaPipeLoaded) {
    console.log("Initializing MediaPipe assets...");

    try {
      // Set up proper WASM module configuration to prevent buffer errors
      const MEDIAPIPE_CDN_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240";
      
      // Pre-initialize the Module variable properly before any script loading
      (window as any).Module = (window as any).Module || {};
      (window as any).Module.locateFile = (path: string) => {
        return `${MEDIAPIPE_CDN_URL}/${path}`;
      };
      
      // CRITICAL FIX: The correct property is now 'arguments_' not 'arguments'
      // This addresses the "Module.arguments has been replaced with plain arguments_" error
      (window as any).Module.arguments_ = [];
      // Also unset the old property to avoid conflicts
      delete (window as any).Module.arguments;
      
      // Use modern WASM instantiation approach
      (window as any).Module.instantiateWasm = (imports: any, successCallback: Function) => {
        // Create a proper URL to the WASM binary
        const wasmUrl = `${MEDIAPIPE_CDN_URL}/hands.wasm`;
        
        // Use fetch to get the WASM binary
        fetch(wasmUrl)
          .then(response => response.arrayBuffer())
          .then(buffer => WebAssembly.instantiate(buffer, imports))
          .then(output => {
            successCallback(output.instance);
          })
          .catch(error => {
            console.error('WASM instantiation failed:', error);
          });
        return {}; // Return empty object to signal we're handling instantiation manually
      };
      
      // These properties should stay as is
      (window as any).Module.thisProgram = "./this.program";
      (window as any).Module.quit = (status: number, toThrow: Error) => {
        throw toThrow;
      };
      
      // Preload the WASM data (optional, but can help with some loading issues)
      const preloadWasm = async () => {
        try {
          const wasmUrl = `${MEDIAPIPE_CDN_URL}/hands_solution_packed_assets_loader.js`;
          const loaderResponse = await fetch(wasmUrl);
          if (loaderResponse.ok) {
            console.log("WASM loader preloaded successfully");
          }
        } catch (e) {
          console.warn("WASM preloading failed, will try direct loading:", e);
        }
      };
      
      // Helper function to load scripts properly with timeout and retry
      const loadScript = (src: string, retries = 2) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.crossOrigin = 'anonymous';
          script.async = true;
          
          const timeout = setTimeout(() => {
            console.warn(`Script load timeout: ${src}`);
            if (retries > 0) {
              console.log(`Retrying script load: ${src}, ${retries} attempts left`);
              clearTimeout(timeout);
              loadScript(src, retries - 1).then(resolve).catch(reject);
            } else {
              reject(new Error(`Script load timeout after retries: ${src}`));
            }
          }, 15000); // 15 second timeout
          
          script.onload = () => {
            clearTimeout(timeout);
            resolve(undefined);
          };
          
          script.onerror = (err) => {
            clearTimeout(timeout);
            if (retries > 0) {
              console.log(`Retrying script load after error: ${src}, ${retries} attempts left`);
              loadScript(src, retries - 1).then(resolve).catch(reject);
            } else {
              reject(err);
            }
          };
          
          document.head.appendChild(script);
        });
      };
      
      // Execute preload and script loading
      (async () => {
        try {
          await preloadWasm();
          console.log("Loading MediaPipe hands.js...");
          await loadScript(`${MEDIAPIPE_CDN_URL}/hands.js`);
          console.log("MediaPipe hands.js loaded successfully");
          (window as any).__mediaPipeLoaded = true;
        } catch (err) {
          console.error("Failed to load MediaPipe:", err);
          // If loading fails, setup a fallback mechanism
          (window as any).__mediaPipeLoadFailed = true;
        }
      })();
    } catch (e) {
      console.error("Error during MediaPipe initialization:", e);
    }
  }
};

// Generate SVG content for placeholders
const generateSVG = (text: string) => {
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="100%" height="100%" fill="#f5f7fb" />
      <text x="50%" y="50%" font-family="Arial" font-size="120" font-weight="bold" fill="#704ee7" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
};

// Fix 1: Add interface for landmark types
interface HandLandmark {
  x: number;
  y: number;
  z?: number;
}

// Fix 2: Add result type
interface HandTrackingResult {
  multiHandLandmarks?: HandLandmark[][];
}

export default function InteractiveLessonPage() {
  // Initialize assets when component mounts
  useEffect(() => {
    loadMediaPipeAssets();
  }, []);

  // State for webcam and lesson
  const [cameraActive, setCameraActive] = useState(false)
  const [lessonStatus, setLessonStatus] = useState("waiting") // waiting, recording, success, failure
  const [progress, setProgress] = useState(0)
  const [currentGesture, setCurrentGesture] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showTryAgain, setShowTryAgain] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [lessonType, setLessonType] = useState("alphabet") // alphabet or number
  const [targetSign, setTargetSign] = useState("A") // Current sign to learn
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isInitializingCamera, setIsInitializingCamera] = useState(false)
  const [videoElementReady, setVideoElementReady] = useState(false)
  const [domLoaded, setDomLoaded] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hiddenVideoRef = useRef<HTMLVideoElement>(null)

  // Threshold for "Try Again" button
  const ACCURACY_THRESHOLD = 70

  // Ensure DOM is loaded before trying to access elements
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  // Improved tracking for video element availability with retry mechanism
  useEffect(() => {
    if (!domLoaded) return;

    // Check if video elements are available
    const checkVideoElement = () => {
      if (videoRef.current || hiddenVideoRef.current) {
        setVideoElementReady(true);
        return true;
      }
      return false;
    };

    // Try immediately first
    if (checkVideoElement()) return;

    // If not available, set up a retry mechanism
    let attempts = 0;
    const maxAttempts = 5;
    const retryInterval = setInterval(() => {
      attempts++;
      if (checkVideoElement() || attempts >= maxAttempts) {
        clearInterval(retryInterval);
        if (attempts >= maxAttempts && !videoElementReady) {
          console.warn("Could not find video element after multiple attempts");
        }
      }
    }, 500); // Check every 500ms

    return () => clearInterval(retryInterval);
  }, [domLoaded]);

  // Get current lessons based on lesson type
  const currentLessons = lessonType === "alphabet" ? ALPHABET_LESSONS : NUMBER_LESSONS

  // Get lesson content for the current target sign
  const lessonContent = {
    id: currentLessons.indexOf(targetSign) + 1,
    name: targetSign,
    description: `Sign for ${lessonType === "alphabet" ? "letter" : "number"} ${targetSign}`,
    difficulty: "Beginner",
    imageUrl: generateSVG(targetSign),
    instructions: [
      `Position your hand in front of the camera`,
      `Form the ${lessonType === "alphabet" ? "letter" : "number"} ${targetSign} sign`,
      `Hold the position steady for best recognition`,
      `Try to match the example image shown`,
    ],
  }

  // Use our custom hook for hand tracking with better error handling
  const { 
    handLandmarks, 
    prediction, 
    isHandDetected, 
    cameraError: trackingCameraError,
    resetTracking,
    isMockMode
  } = useHandTracking({
    // Only pass a valid video reference to avoid null ref errors
    // The fallback mechanism handles null refs by using either videoRef or hiddenVideoRef
    videoRef: videoElementReady ? 
      (videoRef.current ? videoRef : hiddenVideoRef) as React.RefObject<HTMLVideoElement> : 
      (hiddenVideoRef.current ? hiddenVideoRef : videoRef) as React.RefObject<HTMLVideoElement>,
    enabled: cameraActive && !isPaused,
    onResults: (results: HandTrackingResult) => {
      // Only process if we have a valid canvas reference to avoid errors
      if (!canvasRef.current) return;
      
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      
      const canvas = canvasRef.current;
      
      // Always clear canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw landmarks if available
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        try {
          drawHandLandmarks(ctx, results.multiHandLandmarks[0]);
        } catch (error) {
          console.error("Error drawing hand landmarks:", error);
        }
      }
    },
  });

  // Start camera with delay to ensure DOM is ready
  const startCamera = async () => {
    try {
      // Reset any existing camera error
      setCameraError(null);
      setIsInitializingCamera(true);

      // Add a small delay to ensure DOM is fully loaded and stable
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find an available video element
      const videoElement = videoRef.current || hiddenVideoRef.current;
      
      // Make sure video element is ready
      if (!videoElement) {
        console.error("Video element is not available yet");
        setCameraError("Camera initialization failed: Video element not ready. Please refresh and try again.");
        setIsInitializingCamera(false);
        return;
      }
      
      // Check if we're in a secure context (HTTPS or localhost)
      // Allow localhost as it's considered secure for development
      const isLocalhost = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('192.168.') ||
         window.location.hostname.includes('.local'));
      
      const isSecureContext = window.isSecureContext === true || isLocalhost;
      
      if (!isSecureContext) {
        console.error("Camera access requires a secure context (HTTPS)");
        setCameraError(`Camera access requires a secure context (HTTPS). To access your camera:

1. Access the site via HTTPS instead of HTTP
2. Or use localhost for development (http://localhost works)
3. Or run this command to serve with HTTPS locally:
   npx serve --ssl-cert cert.pem --ssl-key key.pem
4. Or deploy to a hosting service that provides HTTPS automatically`);
        setIsInitializingCamera(false);
        return;
      }

      // Enhanced browser detection
      try {
        // If this is a known problematic browser, polyfill the API
        const { name, version } = getBrowserInfo();
        
        // Fix 4: Check for mediaDevices instead of directly assigning to it
        if (!navigator.mediaDevices) {
          console.warn("navigator.mediaDevices is not available in this browser");
          throw new Error("Camera API not available. Please try using a different browser.");
        }
        
        if (!navigator.mediaDevices.getUserMedia) {
          try {
            // Fix 5: Use correct TypeScript cast
            (navigator.mediaDevices as any).getUserMedia = function(constraints: MediaStreamConstraints) {
              const getUserMedia = (navigator as any).webkitGetUserMedia ||
                                (navigator as any).mozGetUserMedia || 
                                (navigator as any).msGetUserMedia;
              
              if (!getUserMedia) {
                return Promise.reject(new Error("getUserMedia is not implemented in this browser"));
              }
              
              return new Promise((resolve, reject) => {
                getUserMedia.call(navigator, constraints, resolve, reject);
              });
            };
          } catch (mediaDevicesError) {
            console.error("Failed to polyfill getUserMedia", mediaDevicesError);
            throw new Error("Camera API not fully supported in this browser.");
          }
        }
        
        // Double-check video element is still available (could be unmounted)
        if (!videoElement) {
          throw new Error("Video element not available");
        }
        
        // Clean up any existing MediaPipe instances
        if (typeof resetTracking === 'function') {
          resetTracking();
        }
        
        // Directly try to access the camera with better constraints
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 640, max: 1280 },
            height: { ideal: 480, max: 720 },
            frameRate: { ideal: 30, max: 60 },
            facingMode: 'user'
          },
          audio: false
        });
        
        // If we get here, camera access is successful
        // Set up video element with the stream
        videoElement.srcObject = stream;
        
        // Wait for the video to be ready
        await new Promise((resolve) => {
          if (!videoElement) {
            resolve(null);
            return;
          }
          
          const onLoadedMetadata = () => {
            videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
            resolve(null);
          };
          
          videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
          
          // If already loaded, resolve immediately
          if (videoElement.readyState >= 2) {
            resolve(null);
          }
        });
        
        // Start playing the video with improved error handling
        try {
          videoElement.muted = true; // Always mute initially for autoplay
          await videoElement.play();
        } catch (playError) {
          console.warn("Initial play failed, trying with fallback options:", playError);
          
          // Try different play options if initial attempt fails
          try {
            // Add playsinline attribute explicitly
            videoElement.setAttribute('playsinline', 'true');
            await videoElement.play();
          } catch (secondPlayError) {
            console.error("Failed to play video after multiple attempts:", secondPlayError);
            throw new Error("Browser prevented video playback. Please check your permissions.");
          }
        }
        
        // Camera is now active
        setCameraActive(true);
        setLessonStatus("waiting");
        setShowTryAgain(false);
        setFeedbackMessage("");
        setCameraError(null);
        setIsInitializingCamera(false);
      } catch (err: unknown) {
        console.error("Camera access failed:", err);
        
        let errorMessage = "Camera access denied. Please check your browser permissions.";
        // Fix 6: Type-safe error handling
        const errorName = err instanceof Error ? err.name : '';
        const browserInstructions = getBrowserSpecificInstructions();
        
        // Provide more specific error messages based on the error type
        if (errorName.includes("NotFound") || errorName.includes("DevicesNotFound")) {
          errorMessage = `No camera found. Please connect a camera and try again.\n\n${browserInstructions}`;
        } else if (errorName.includes("NotAllowed") || errorName.includes("Permission")) {
          errorMessage = `Camera access denied. ${browserInstructions}`;
        } else if (errorName.includes("NotReadable") || errorName.includes("TrackStart")) {
          errorMessage = `Your camera is in use by another application. Please close other apps using your camera.`;
        } else if (errorName.includes("Overconstrained")) {
          errorMessage = `Camera does not meet the required constraints.`;
        } else if (errorName.includes("Type")) {
          errorMessage = `Invalid camera parameters.`;
        } else if (errorName.includes("Abort")) {
          errorMessage = `Camera access was aborted.`;
        } else if (errorName.includes("NotSupported")) {
          errorMessage = `Camera access is not supported in this browser. Please try a modern browser like Chrome or Firefox.`;
        } else if (errorName.includes("Security")) {
          errorMessage = `Camera access was blocked due to security restrictions.`;
        } else if (err instanceof Error && err.message.includes("mediaDevices")) {
          // Custom handling for mediaDevices missing in Chrome but User-Agent says Chrome
          errorMessage = `Camera API not initialized properly. Please try:\n
1. Refreshing the page
2. ${browserInstructions}
3. Using incognito/private browsing mode
4. Clearing browser cache`;
        } else if (err instanceof Error && err.message.includes("Video element not available")) {
          errorMessage = `Camera initialization failed: Video element not ready. Please refresh and try again.`;
        }
        
        setCameraError(errorMessage);
        setIsInitializingCamera(false);
      }
    } catch (err: unknown) {
      console.error("Unexpected error accessing camera:", err);
      setCameraError("Failed to access camera. Please refresh the page and try again.");
      setIsInitializingCamera(false);
    }
  }

  // Stop camera with improved cleanup
  const stopCamera = () => {
    // Get video elements that might have a stream
    const videoElements = [videoRef.current, hiddenVideoRef.current].filter(Boolean);
    
    // Stop all tracks from all video elements
    videoElements.forEach(videoEl => {
      if (videoEl && videoEl.srcObject) {
        const stream = videoEl.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => {
            track.stop();
            stream.removeTrack(track);
          });
          videoEl.srcObject = null;
        }
      }
    });
    
    // Clean up MediaPipe if there's a reset function
    if (typeof resetTracking === 'function') {
      resetTracking();
    }

    setCameraActive(false);
    setLessonStatus("waiting");
    setProgress(0);
    setShowTryAgain(false);
    setFeedbackMessage("");
    setCameraError(null);
  }

  // Draw hand landmarks on canvas
  const drawHandLandmarks = (ctx: CanvasRenderingContext2D, landmarks: HandLandmark[]) => {
    if (!ctx || !landmarks) return;
    if (!canvasRef.current) return;

    // Draw landmarks
    landmarks.forEach((landmark: HandLandmark, index: number) => {
      const x = landmark.x * canvasRef.current!.width;
      const y = landmark.y * canvasRef.current!.height;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#704ee7";
      ctx.fill();

      // Draw index number
      ctx.fillStyle = "white";
      ctx.font = "8px Arial";
      ctx.fillText(index.toString(), x - 2, y + 2);
    });

    // Connect landmarks with lines (hand connections)
    // Thumb
    drawLine(ctx, landmarks, 0, 1);
    drawLine(ctx, landmarks, 1, 2);
    drawLine(ctx, landmarks, 2, 3);
    drawLine(ctx, landmarks, 3, 4);

    // Index finger
    drawLine(ctx, landmarks, 0, 5);
    drawLine(ctx, landmarks, 5, 6);
    drawLine(ctx, landmarks, 6, 7);
    drawLine(ctx, landmarks, 7, 8);

    // Middle finger
    drawLine(ctx, landmarks, 0, 9);
    drawLine(ctx, landmarks, 9, 10);
    drawLine(ctx, landmarks, 10, 11);
    drawLine(ctx, landmarks, 11, 12);

    // Ring finger
    drawLine(ctx, landmarks, 0, 13);
    drawLine(ctx, landmarks, 13, 14);
    drawLine(ctx, landmarks, 14, 15);
    drawLine(ctx, landmarks, 15, 16);

    // Pinky finger
    drawLine(ctx, landmarks, 0, 17);
    drawLine(ctx, landmarks, 17, 18);
    drawLine(ctx, landmarks, 18, 19);
    drawLine(ctx, landmarks, 19, 20);

    // Palm
    drawLine(ctx, landmarks, 0, 5);
    drawLine(ctx, landmarks, 5, 9);
    drawLine(ctx, landmarks, 9, 13);
    drawLine(ctx, landmarks, 13, 17);
  }

  // Helper function to draw lines between landmarks
  const drawLine = (ctx: CanvasRenderingContext2D, landmarks: HandLandmark[], index1: number, index2: number) => {
    if (!ctx || !landmarks || !landmarks[index1] || !landmarks[index2] || !canvasRef.current) return;

    const x1 = landmarks[index1].x * canvasRef.current.width;
    const y1 = landmarks[index1].y * canvasRef.current.height;
    const x2 = landmarks[index2].x * canvasRef.current.width;
    const y2 = landmarks[index2].y * canvasRef.current.height;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "#704ee7";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Update feedback based on prediction
  const updateFeedback = (predictedSign: string, confidence: number) => {
    const confidencePercent = Math.round(confidence * 100);

    // Check if the prediction matches the target sign
    if (predictedSign === targetSign) {
      if (confidence > 0.8) {
        setFeedbackMessage(`Excellent! Your "${targetSign}" sign is very accurate.`);
      } else if (confidence > 0.6) {
        setFeedbackMessage(`Good! Your "${targetSign}" sign is recognizable.`);
      } else {
        setFeedbackMessage(`Your "${targetSign}" sign is detected but try to be more precise.`);
      }
      setShowTryAgain(false);
    } else {
      setFeedbackMessage(
        `The system detected "${predictedSign}" instead of "${targetSign}". Adjust your hand position.`,
      );
      setShowTryAgain(confidencePercent < ACCURACY_THRESHOLD);
    }
  }

  // Process prediction results
  useEffect(() => {
    if (cameraActive && lessonStatus === "recording" && !isPaused && prediction.prediction) {
      const confidencePercent = Math.round(prediction.confidence * 100);

      // Update feedback based on prediction
      updateFeedback(prediction.prediction, prediction.confidence);

      // Update progress if the prediction matches the target
      if (prediction.prediction === targetSign && prediction.confidence > 0.7) {
        setProgress((prev) => {
          const newProgress = prev + 1;

          // When progress reaches 100%, move to next sign or complete
          if (newProgress >= 100) {
            if (currentGesture < currentLessons.length - 1) {
              setCurrentGesture((prev) => prev + 1);
              setTargetSign(currentLessons[currentGesture + 1]);
              return 0; // Reset progress for next sign
            } else {
              setLessonStatus("success");
            }
          }

          return Math.min(newProgress, 100);
        });
      }
    }
  }, [prediction, cameraActive, lessonStatus, isPaused, targetSign, currentGesture, currentLessons]);

  // Get color for feedback bar based on accuracy
  const getFeedbackColor = (score: number) => {
    if (score > 80) return "bg-[#57e371]"; // Green
    if (score >= 60) return "bg-[#f0c332]"; // Yellow
    return "bg-[#ff6265]"; // Red
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch((err: Error) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Start lesson recording
  const startRecording = () => {
    setLessonStatus("recording");
    setProgress(0);
    setShowTryAgain(false);
    setFeedbackMessage("");
  };

  // Try again - reset current gesture
  const tryAgain = () => {
    setProgress(0);
    setShowTryAgain(false);
    setFeedbackMessage("");
  };

  // Pause/resume lesson
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Reset lesson
  const resetLesson = () => {
    setLessonStatus("waiting");
    setProgress(0);
    setCurrentGesture(0);
    setTargetSign(currentLessons[0]);
    setShowTryAgain(false);
    setFeedbackMessage("");
  };

  // Toggle between alphabet and number lessons
  const toggleLessonType = () => {
    const newType = lessonType === "alphabet" ? "number" : "alphabet";
    setLessonType(newType);
    setTargetSign(newType === "alphabet" ? "A" : "0");
    setCurrentGesture(0);
    setProgress(0);
    setLessonStatus("waiting");
  };

  // Initialize target sign when component mounts
  useEffect(() => {
    setTargetSign(lessonType === "alphabet" ? "A" : "0");
  }, [lessonType]);

  // Update component's camera error state when tracking hook reports an error
  useEffect(() => {
    if (trackingCameraError) {
      setCameraError(trackingCameraError);
      setIsInitializingCamera(false);
      setCameraActive(false);
    }
  }, [trackingCameraError]);

  // Periodically check if camera becomes available after initially failing
  useEffect(() => {
    // Only run this recovery if:
    // 1. We have a camera error
    // 2. We're not already initializing the camera
    if (!cameraError || isInitializingCamera) return;

    // Check availability every 10 seconds
    const checkInterval = setInterval(async () => {
      if (typeof window !== 'undefined' && navigator && navigator.mediaDevices) {
        try {
          // Try a quick permission check without showing any UI
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          
          // If we got here, camera is now available
          stream.getTracks().forEach(track => track.stop()); // Release the stream
          
          console.log("Camera has become available. Attempting recovery...");
          setCameraError(null);
          startCamera();
          
          // Clear the interval since we've recovered
          clearInterval(checkInterval);
        } catch (e) {
          // Still not available, keep waiting
          console.debug("Camera still not available during recovery check");
        }
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(checkInterval);
  }, [cameraError, isInitializingCamera]);

  return (
    <div className="flex h-screen bg-[#f5f7fb] overflow-hidden" ref={containerRef}>
      {/* Hidden video element for reliable reference */}
      <video 
        ref={hiddenVideoRef}
        style={{ display: 'none', position: 'absolute', width: '1px', height: '1px', opacity: 0 }}
        autoPlay 
        playsInline
        muted
      />
      
      {/* Main Content - Removed duplicate sidebar since it's already in dashboard layout */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/lessons" className="flex items-center text-[#64748b] hover:text-[#704ee7]">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Lessons
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLessonType}
              className="bg-[#e3dbfe] text-[#704ee7] text-xs px-3 py-1 rounded-full hover:bg-[#d5cfff]"
            >
              {lessonType === "alphabet" ? "Switch to Numbers" : "Switch to Alphabet"}
            </button>
            <div className="bg-[#e3dbfe] text-[#704ee7] text-xs px-3 py-1 rounded-full">
              {lessonType === "alphabet" ? "Letter" : "Number"} {currentGesture + 1}/{currentLessons.length}
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Panel - Instructions */}
          <div className="w-full md:w-1/2 h-full overflow-auto">
            <div className="p-6 h-full">
              <div className="bg-white rounded-xl p-6 h-full overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-[#191d23]">
                    {lessonType === "alphabet" ? "Letter" : "Number"} {lessonContent.name}
                  </h1>
                  <div className="bg-[#e3dbfe] text-[#704ee7] text-xs px-3 py-1 rounded-full">
                    {lessonContent.difficulty}
                  </div>
                </div>

                <p className="text-[#64748b] mb-6">{lessonContent.description}</p>

                <div className="bg-[#f5f7fb] rounded-lg overflow-hidden mb-6 flex items-center justify-center">
                  <img 
                    src={lessonContent.imageUrl} 
                    alt={`Sign for ${targetSign}`} 
                    className="object-contain"
                    width={300}
                    height={300}
                  />
                </div>

                <h2 className="text-lg font-bold text-[#191d23] mb-4">Instructions</h2>
                <ol className="space-y-3 text-[#64748b] mb-6">
                  {lessonContent.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="bg-[#e3dbfe] w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#704ee7] text-xs font-bold">{index + 1}</span>
                      </div>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>

                <div className="bg-[#ffe9ac] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-[#ff2600] text-lg">💡</div>
                    <div className="font-medium text-[#191d23]">Tip</div>
                  </div>
                  <p className="text-sm text-[#64748b]">
                    Make sure your hand is well-lit and clearly visible to the camera. Keep your hand steady for better
                    recognition.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Webcam */}
          <div className="w-full md:w-1/2 h-full bg-[#191d23] flex flex-col">
            <div className="flex-1 p-6 flex flex-col">
              <div className="relative bg-black rounded-lg overflow-hidden flex-1" style={{ minHeight: "300px" }}>
                {!cameraActive ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="mb-4">
                      <Camera className="w-16 h-16 opacity-50" />
                    </div>
                    <p className="text-center mb-4">Enable your camera to practice signing</p>
                    {cameraError && <p className="text-[#ff6265] text-sm mb-4 max-w-xs text-center">{cameraError}</p>}
                    <button
                      onClick={startCamera}
                      disabled={isInitializingCamera}
                      className={`bg-[#704ee7] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2 ${
                        isInitializingCamera ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isInitializingCamera ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Initializing Camera...
                        </>
                      ) : (
                        <>Start Camera</>
                      )}
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted={isMuted}
                      className="w-full h-full object-cover"
                    />

                    <canvas ref={canvasRef} width={640} height={480} className="absolute inset-0 w-full h-full" />

                    {/* Current sign indicator */}
                    <div className="absolute top-4 left-4 bg-black bg-opacity-70 rounded-lg px-3 py-2 text-white">
                      <div className="text-xs mb-1">Current Sign</div>
                      <div className="text-3xl font-bold">{targetSign}</div>
                    </div>

                    {/* Prediction indicator */}
                    {lessonStatus === "recording" && (
                      <div className="absolute top-4 right-4 bg-black bg-opacity-70 rounded-lg px-3 py-2 text-white">
                        <div className="text-xs mb-1">Detected Sign</div>
                        <div className="text-3xl font-bold">{prediction.prediction || "?"}</div>
                        <div className="text-xs opacity-70">Confidence: {Math.round(prediction.confidence * 100)}%</div>
                      </div>
                    )}

                    {/* Success overlay */}
                    {lessonStatus === "success" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                        <div className="bg-white p-6 rounded-xl max-w-xs text-center">
                          <div className="flex justify-center mb-4">
                            <CheckCircle className="w-16 h-16 text-[#57e371]" />
                          </div>
                          <h3 className="text-xl font-bold text-[#191d23] mb-2">Lesson Complete!</h3>
                          <p className="text-[#64748b] mb-4">You've successfully completed all the signs!</p>
                          <div className="flex flex-col gap-2">
                            <Link
                              href="/dashboard/lessons"
                              className="bg-[#704ee7] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 w-full"
                            >
                              Back to Lessons
                            </Link>
                            <button
                              onClick={resetLesson}
                              className="border border-[#d0d5dd] px-6 py-2 rounded-lg hover:bg-gray-50 w-full"
                            >
                              Practice Again
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Camera error overlay */}
                    {cameraError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg p-4 text-center">
                        <div className="bg-background p-6 rounded-lg shadow-lg max-w-md">
                          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
                          <h3 className="text-xl font-bold mb-2 text-white">Camera Issue</h3>
                          <div className="text-gray-300 mb-4 text-left whitespace-pre-line">{cameraError}</div>
                          
                          <div className="space-y-3">
                            <p className="text-sm text-white font-semibold">Common Solutions:</p>
                            <ul className="text-sm text-left list-disc pl-5 space-y-1 text-gray-300">
                              <li>Allow camera access in your browser permissions</li>
                              <li>Make sure no other application is using your camera</li>
                              <li>Try refreshing the page</li>
                              <li>Try using incognito/private browsing mode</li>
                              <li>Clear your browser cache</li>
                              {cameraError && cameraError.includes("HTTPS") && (
                                <li className="text-yellow-300 font-semibold">Security requirement: Cameras can only be accessed over secure connections (HTTPS or localhost)</li>
                              )}
                              {cameraError && cameraError.includes("camera is in use") && (
                                <li className="text-yellow-300">Close other applications that might be using your camera (like Zoom, Teams, etc.)</li>
                              )}
                            </ul>
                          </div>
                          
                          <div className="mt-6 flex justify-center">
                            <button
                              onClick={() => {
                                setCameraError(null);
                                startCamera();
                              }}
                              className="px-4 py-2 bg-[#704ee7] text-white rounded-md flex items-center gap-2 hover:bg-opacity-90"
                            >
                              <RefreshCw className="w-4 h-4" /> Try Again
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Real-time Score Display */}
              {cameraActive && lessonStatus === "recording" && (
                <div className="mt-4 bg-[#111418] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-white font-bold text-lg">
                      Score: {Math.round(prediction.confidence * 100)}%
                    </div>
                    {showTryAgain && (
                      <button
                        onClick={tryAgain}
                        className="bg-[#ff6265] text-white px-4 py-1 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                      </button>
                    )}
                  </div>

                  {/* Color-coded feedback bar */}
                  <div className="h-3 bg-white bg-opacity-20 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${getFeedbackColor(Math.round(prediction.confidence * 100))} rounded-full transition-all duration-300`}
                      style={{ width: `${Math.round(prediction.confidence * 100)}%` }}
                    ></div>
                  </div>

                  {/* Feedback message */}
                  <div className="flex items-start gap-2 mt-2">
                    {prediction.confidence < ACCURACY_THRESHOLD / 100 && (
                      <AlertTriangle className="w-4 h-4 text-[#f0c332] flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-white text-sm opacity-80">{feedbackMessage}</p>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-wrap justify-between gap-4 mt-4">
                <div className="flex gap-2">
                  {cameraActive && (
                    <>
                      {lessonStatus === "waiting" ? (
                        <button
                          onClick={startRecording}
                          className="bg-[#704ee7] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Start Practice
                        </button>
                      ) : (
                        <button
                          onClick={togglePause}
                          className="bg-[#704ee7] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                        >
                          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                          {isPaused ? "Resume" : "Pause"}
                        </button>
                      )}
                      <button
                        onClick={stopCamera}
                        className="border border-[#d0d5dd] text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2"
                      >
                        <CameraOff className="w-4 h-4" />
                        Stop Camera
                      </button>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  {cameraActive && (
                    <>
                      <button
                        onClick={toggleMute}
                        className="border border-[#d0d5dd] text-white px-3 py-2 rounded-lg hover:bg-gray-800"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={resetLesson}
                        className="border border-[#d0d5dd] text-white px-3 py-2 rounded-lg hover:bg-gray-800"
                        aria-label="Reset lesson"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {cameraActive && lessonStatus === "recording" && (
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-white mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#704ee7] rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-xs text-white opacity-70">
                      {lessonType === "alphabet" ? "Letter" : "Number"} {currentGesture + 1} of {currentLessons.length}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-white opacity-70 hover:opacity-100 flex items-center gap-1 text-xs"
                        onClick={() => setProgress((prev) => Math.min(prev + 10, 100))}
                      >
                        <ThumbsUp className="w-3 h-3" /> Skip
                      </button>
                      <button
                        className="text-white opacity-70 hover:opacity-100 flex items-center gap-1 text-xs"
                        onClick={() => setProgress(0)}
                      >
                        <ThumbsDown className="w-3 h-3" /> Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
