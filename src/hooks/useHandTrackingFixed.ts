"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import type { Results } from "@mediapipe/hands"
import { type HandLandmark, type PredictionResult, predictGesture, getRandomPrediction } from "@/utils/handGestureService"
import { FallbackCamera } from "@/utils/cameraUtils"

// Ensure MediaPipe types are available
declare global {
  interface Window {
    Hands: any;
  }
}

// Define a type for the Hands class since we're loading it dynamically
type HandsType = {
  new(options: { locateFile: (file: string) => string }): {
    setOptions: (options: any) => void;
    onResults: (callback: (results: Results) => void) => void;
    send: (options: { image: HTMLVideoElement }) => Promise<void>;
  };
};

interface UseHandTrackingProps {
  videoRef: React.RefObject<HTMLVideoElement>
  enabled: boolean
  onResults?: (results: Results) => void
}

// Load MediaPipe scripts directly with retries
const loadMediaPipeScript = async (retries = 3): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // Check if script already exists
    if (document.querySelector('script[src*="hands.js"]')) {
      resolve();
      return;
    }

    const handleScriptLoad = () => {
      console.log("MediaPipe script loaded successfully");
      resolve();
    };

    const handleScriptError = () => {
      if (retries > 0) {
        console.warn(`Failed to load MediaPipe script, retrying (${retries} attempts left)...`);
        // Wait 1 second before retry
        setTimeout(() => {
          loadMediaPipeScript(retries - 1)
            .then(resolve)
            .catch(reject);
        }, 1000);
      } else {
        reject(new Error('Failed to load MediaPipe script after multiple attempts'));
      }
    };

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js';
    script.crossOrigin = 'anonymous';
    script.onload = handleScriptLoad;
    script.onerror = handleScriptError;

    // Add backup timeout for script loading
    const timeoutId = setTimeout(() => {
      if (retries > 0) {
        console.warn('MediaPipe script load timeout, retrying...');
        loadMediaPipeScript(retries - 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error('MediaPipe script load timeout after multiple attempts'));
      }
    }, 10000); // 10 second timeout

    script.addEventListener('load', () => {
      clearTimeout(timeoutId);
    });

    document.head.appendChild(script);
  });
};

// Polyfill for older browsers or when MediaDevices API is not initialized
const ensureMediaDevices = () => {
  // We can't directly assign to navigator.mediaDevices as it's read-only
  if (!navigator.mediaDevices) {
    console.warn("navigator.mediaDevices is not available in this browser");
    return false;
  }

  if (!navigator.mediaDevices.getUserMedia) {
    try {
      navigator.mediaDevices.getUserMedia = function(constraints) {
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
    } catch (e) {
      console.error("Failed to polyfill getUserMedia", e);
      return false;
    }
  }
  
  return true;
};

export function useHandTracking({ videoRef, enabled, onResults }: UseHandTrackingProps) {
  const [handLandmarks, setHandLandmarks] = useState<HandLandmark[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult>({ prediction: "", confidence: 0 });
  const [isHandDetected, setIsHandDetected] = useState(false);
  const [useMockImplementation, setUseMockImplementation] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Make sure we have a valid videoRef before proceeding
  const validVideoRef = videoRef && videoRef.current ? videoRef : null;

  const cameraRef = useRef<FallbackCamera | null>(null);
  const handsRef = useRef<any>(null);
  const requestRef = useRef<number | null>(null);
  const lastPredictionTimeRef = useRef<number>(0);
  const mockIntervalRef = useRef<any>(null);
  const initializingRef = useRef<boolean>(false);
  const initializationAttemptsRef = useRef<number>(0);
  const maxInitAttempts = 3;

  // Helper function for mock tracking (implementation unchanged)
  const initializeMockTracking = useCallback((errorMessage: string = "Camera not available") => {
    console.warn("Using mock hand tracking implementation:", errorMessage);
    setUseMockImplementation(true);
    setCameraError(errorMessage);
    
    // Start a mock camera
    if (validVideoRef && validVideoRef.current) {
      try {
        // Create a simple animation in the video element to show it's active
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          const drawFrame = () => {
            if (!enabled) return;
            
            // Draw a simple animation
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw a hand outline
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2, 50 + Math.sin(Date.now() / 500) * 10, 0, 2 * Math.PI);
            ctx.strokeStyle = '#704ee7';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw some dots for fingers
            for (let i = 0; i < 5; i++) {
              const angle = (i / 5) * Math.PI;
              const x = canvas.width/2 + Math.cos(angle) * 70;
              const y = canvas.height/2 + Math.sin(angle) * 70;
              
              ctx.beginPath();
              ctx.arc(x, y, 8, 0, 2 * Math.PI);
              ctx.fillStyle = '#704ee7';
              ctx.fill();
            }
            
            // Draw text
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.fillText('Mock Hand Tracking (MediaPipe not available)', 20, 30);
            ctx.fillText(errorMessage, 20, 60);
            ctx.fillText('Please check your camera permissions', 20, 90);
            ctx.fillText('or try using a different browser', 20, 120);
            
            // Create an animation frame
            requestRef.current = requestAnimationFrame(drawFrame);
          };
          
          drawFrame();
          
          // Create a mock stream from the canvas
          try {
            const stream = canvas.captureStream(30);
            validVideoRef.current.srcObject = stream;
            validVideoRef.current.play().catch(e => console.error("Error playing video:", e));
          } catch (streamError) {
            console.error("Error creating mock stream:", streamError);
          }
        }
      } catch (error) {
        console.error("Error setting up mock video:", error);
      }
    }
    
    // Set up an interval to provide mock predictions
    mockIntervalRef.current = setInterval(() => {
      const mockPrediction = getRandomPrediction();
      setPrediction(mockPrediction);
      setIsHandDetected(Math.random() > 0.2); // Occasionally "lose" hand detection
    }, 300);
  }, [enabled, validVideoRef]);

  // Function to clean up and reset the tracking
  const resetTracking = useCallback(() => {
    // Clean up MediaPipe Hands instance
    if (handsRef.current) {
      try {
        handsRef.current.close();
      } catch (e) {
        console.warn("Error closing MediaPipe Hands:", e);
      }
      handsRef.current = null;
    }

    // Clean up camera reference
    if (cameraRef.current) {
      try {
        cameraRef.current.stop();
      } catch (e) {
        console.warn("Error stopping camera:", e);
      }
      cameraRef.current = null;
    }

    // Clean up animation frame reference
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }

    // Clean up mock interval
    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
      mockIntervalRef.current = null;
    }

    // Reset state
    setIsInitialized(false);
    setHandLandmarks([]);
    setPrediction({ prediction: "", confidence: 0 });
    setIsHandDetected(false);
    initializingRef.current = false;
    initializationAttemptsRef.current = 0;
  }, []);

  // Modified camera permission check
  const checkCameraPermissions = useCallback(async (): Promise<boolean> => {
    try {
      // Handle cases where mediaDevices might not be initialized properly yet
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("MediaDevices API not properly initialized");
        
        // Try to polyfill again
        try {
          const polyfillResult = ensureMediaDevices();
          if (!polyfillResult) {
            initializeMockTracking('Camera API not available. Please try using a different browser.');
            return false;
          }
        } catch (polyfillError) {
          console.error("Failed to polyfill MediaDevices:", polyfillError);
          initializeMockTracking('Camera API not available. Please try using a different browser.');
          return false;
        }
        
        // Check if polyfill worked
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          initializeMockTracking('Camera API not available. Please try using a different browser.');
          return false;
        }
      }

      // Check if we can access the camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          facingMode: 'user' 
        } 
      });
      
      // If we got this far, we have access
      // Clean up the stream since we'll reinitialize it later
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error("Camera permission check failed:", error);
      
      // More flexible error handling
      const errorName = error && (error as any).name ? (error as any).name : '';
      const errorMessage = error && (error as any).message ? (error as any).message : '';
      
      if (errorName.includes('NotAllowed') || errorName.includes('Permission') || 
          errorMessage.includes('permission')) {
        initializeMockTracking('Camera access denied. Please allow camera access in your browser settings.');
      } else if (errorName.includes('NotFound') || errorName.includes('DevicesNotFound') || 
                 errorMessage.includes('device') || errorMessage.includes('camera not found')) {
        initializeMockTracking('No camera found. Please connect a camera and try again.');
      } else if (errorName.includes('NotReadable') || errorName.includes('TrackStart') || 
                 errorMessage.includes('in use')) {
        initializeMockTracking('Camera is in use by another application.');
      } else if (errorName.includes('Overconstrained') || 
                 errorMessage.includes('constraint')) {
        initializeMockTracking('Camera does not meet the required constraints.');
      } else if (errorName.includes('TypeError') || 
                 errorMessage.includes('type')) {
        initializeMockTracking('Invalid constraints or parameters for camera.');
      } else if (errorName.includes('NotSupported') || 
                 errorMessage.includes('support')) {
        initializeMockTracking('Your browser does not support camera access.');
      } else if (errorName.includes('Security') || 
                 errorMessage.includes('secure')) {
        initializeMockTracking('Camera access requires a secure connection (HTTPS).');
      } else {
        initializeMockTracking(`Camera error: ${errorMessage || errorName || 'Unknown error'}`);
      }
      return false;
    }
  }, [initializeMockTracking]);

  // Initialize MediaPipe
  const initializeHandTracking = useCallback(async () => {
    // First check if we have camera permissions
    const hasPermission = await checkCameraPermissions();
    if (!hasPermission) return;
    
    try {
      // Check if window.Module is already defined
      if (!(window as any).Module) {
        (window as any).Module = {
          locateFile: (path: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${path}`;
          },
          arguments: []
        };
      }
      
      // Get MediaPipe Hands constructor
      let Hands: any;
      
      // First try the global object
      if (typeof window.Hands === 'function') {
        Hands = window.Hands;
      } else {
        // Try loading it dynamically
        console.log("MediaPipe Hands not available in window, trying to load dynamically");
        try {
          await loadMediaPipeScript(3);
          
          // Check again after loading
          if (typeof window.Hands === 'function') {
            Hands = window.Hands;
          } else {
            throw new Error("MediaPipe Hands not available after loading");
          }
        } catch (error) {
          console.error("Failed to load MediaPipe script:", error);
          initializeMockTracking('Failed to load hand detection resources');
          initializingRef.current = false;
          return;
        }
      }
      
      if (!Hands) {
        console.error("MediaPipe Hands not available");
        initializeMockTracking('Hand detection library not available');
        initializingRef.current = false;
        return;
      }

      try {
        // Close existing instance if any
        if (handsRef.current) {
          try {
            handsRef.current.close();
          } catch (e) {
            console.warn("Error closing existing MediaPipe Hands:", e);
          }
        }
        
        // Initialize MediaPipe Hands with fixed options
        const hands = new Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`;
          },
        });

        // Configure with appropriate options
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        // Set up the results handler
        hands.onResults((results: Results) => {
          if (onResults) {
            onResults(results);
          }

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            // Convert MediaPipe landmarks to our format
            const landmarks: HandLandmark[] = results.multiHandLandmarks[0].map((landmark) => ({
              x: landmark.x,
              y: landmark.y,
              z: landmark.z,
            }));

            // Batch state updates to prevent cascading re-renders
            requestAnimationFrame(() => {
              // Check if component is still mounted before updating state
              if (!initializingRef.current) {
                setHandLandmarks(landmarks);
                setIsHandDetected(true);
              }
            });

            // Make prediction at most every 200ms to avoid overwhelming the system
            const now = Date.now();
            if (now - lastPredictionTimeRef.current > 200) {
              lastPredictionTimeRef.current = now;

              // Predict gesture based on landmarks
              predictGesture(landmarks).then((result) => {
                // Use RAF to schedule updates outside of the current render cycle
                requestAnimationFrame(() => {
                  if (!initializingRef.current) {
                    setPrediction(result);
                  }
                });
              });
            }
          } else if (isHandDetected) { // Only update if changing from true to false
            requestAnimationFrame(() => {
              if (!initializingRef.current) {
                setIsHandDetected(false);
              }
            });
          }
        });

        // Store the MediaPipe Hands instance in the ref
        handsRef.current = hands;
        
        // Initialize camera using our custom implementation
        if (validVideoRef && validVideoRef.current) {
          try {
            // Create a new camera instance if needed
            if (!cameraRef.current) {
              // Ensure the video element has valid dimensions before initializing
              if (validVideoRef.current.videoWidth === 0 || validVideoRef.current.videoHeight === 0) {
                // Set explicit dimensions if they aren't already set
                validVideoRef.current.width = 640;
                validVideoRef.current.height = 480;
              }
              
              // Add a frame processing throttle to avoid overwhelming the system
              let lastFrameProcessed = 0;
              const FRAME_THROTTLE = 30; // ms between frames (aim for ~30fps)
              
              cameraRef.current = new FallbackCamera(validVideoRef.current, {
                onFrame: async () => {
                  // Throttle frame processing
                  const now = Date.now();
                  if (now - lastFrameProcessed < FRAME_THROTTLE) {
                    return; // Skip this frame
                  }
                  lastFrameProcessed = now;
                  
                  // Only process frames if all conditions are met to prevent infinite loops
                  if (validVideoRef.current && 
                      handsRef.current && 
                      validVideoRef.current.videoWidth > 0 && 
                      validVideoRef.current.videoHeight > 0 &&
                      !initializingRef.current) {
                    try {
                      // Wrap in Promise.race with timeout to prevent hanging
                      await Promise.race([
                        handsRef.current.send({ image: validVideoRef.current }),
                        new Promise((_, reject) => 
                          setTimeout(() => reject(new Error("Frame processing timeout")), 1000)
                        )
                      ]);
                    } catch (error) {
                      // Count consecutive errors to detect persistent issues
                      const errorMessage = error instanceof Error ? error.message : String(error);
                      
                      // Ignore common non-critical errors to reduce noise
                      if (!errorMessage.includes("Aborted") && 
                          !errorMessage.includes("Module.arguments") &&
                          !errorMessage.includes("Maximum update depth exceeded") &&
                          !errorMessage.includes("Frame processing timeout")) {
                        console.error("Error sending frame to MediaPipe:", error);
                        
                        // Don't flood the UI with error messages
                        // Use RAF to schedule state updates outside render cycles
                        requestAnimationFrame(() => {
                          if (!initializingRef.current) {
                            setCameraError('Hand tracking error. Try refreshing the page.');
                          }
                        });
                      }
                    }
                  }
                },
                width: 640,
                height: 480,
              });
            }
            
            // Start the camera
            await cameraRef.current.start().catch(error => {
              console.error("Error starting camera:", error);
              initializeMockTracking('Failed to start camera');
            });
            
            // Mark as initialized
            setIsInitialized(true);
          } catch (error) {
            console.error("Error initializing camera:", error);
            initializeMockTracking('Failed to initialize camera');
          }
        }
      } catch (constructorError) {
        console.error("Error creating Hands constructor:", constructorError);
        initializeMockTracking('Failed to initialize hand detection');
      }
    } catch (error) {
      console.error("Error loading MediaPipe Hands:", error);
      initializeMockTracking('Failed to load hand detection resources');
    } finally {
      initializingRef.current = false;
    }
  }, [checkCameraPermissions, initializeMockTracking, onResults, validVideoRef]);

  // Initialize MediaPipe Hands effect
  useEffect(() => {
    // Don't do anything if not enabled or if no video element is available
    if (!enabled || !validVideoRef || !validVideoRef.current || typeof window === 'undefined') {
      return;
    }
    
    // Don't initialize again if it's already initializing or initialized
    if (initializingRef.current || (isInitialized && handsRef.current)) {
      return;
    }

    // Check if we've already tried too many times
    if (initializationAttemptsRef.current >= maxInitAttempts) {
      console.warn(`Exceeded maximum initialization attempts (${maxInitAttempts}). Falling back to mock implementation.`);
      initializeMockTracking("Failed to initialize after multiple attempts");
      return;
    }
    
    initializingRef.current = true;
    initializationAttemptsRef.current += 1;
    
    // Reset any error state
    setCameraError(null);

    // Check for previous load failures
    if ((window as any).__mediaPipeLoadFailed) {
      console.warn("Previous MediaPipe load failure detected, using mock implementation");
      initializeMockTracking("MediaPipe failed to load properly");
      return;
    }

    // Start initialization
    initializeHandTracking();

    // Clean up
    return () => {
      resetTracking();
    };
  }, [enabled, validVideoRef, isInitialized, initializeHandTracking, initializeMockTracking, resetTracking]);

  return {
    handLandmarks,
    prediction,
    isHandDetected,
    cameraError,
    isInitialized,
    resetTracking,
    isMockMode: useMockImplementation
  };
} 