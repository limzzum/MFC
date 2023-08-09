import React, { useEffect, useRef, useState } from 'react';

const ImageSegmentationComponent = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCaptured, setIsCaptured] = useState(false);
    const [timer, setTimer] = useState(null);
    const [savedData, setSavedData] = useState(null);
    const [savedPixelCount, setSavedPixelCount] = useState(0);

    const captureSilhouette = () => {
        setIsCaptured(true);
        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            setSavedData(imageData);
            const pixelCount = [...imageData.data].filter((val, index) => index % 4 === 3 && val > 0.1).length;
            setSavedPixelCount(pixelCount);
        }
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;

        if (!videoElement || !canvasElement) return;

        const script1 = document.createElement("script");
        script1.src = "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation";
        script1.async = true;
        document.body.appendChild(script1);

        script1.onload = () => {
            const selfieSegmentation = new window.SelfieSegmentation({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
                }
            });

            selfieSegmentation.setOptions({
                modelSelection: 1,
            });

            videoElement.onloadedmetadata = (e) => {
                canvasElement.width = videoElement.videoWidth;
                canvasElement.height = videoElement.videoHeight;
            };

            const silhouetteColor = { r: 100, g: 100, b: 100 };
            const borderColor = { r: 255, g: 0, b: 0 };
            const borderThickness = 5;

            const onResults = (results) => {
                const context = canvasElement.getContext('2d');
                context.clearRect(0, 0, canvasElement.width, canvasElement.height);

                // 고정된 누끼 표시 (처음으로 옮깁니다.)
                if (isCaptured && savedData) {
                    context.putImageData(savedData, 0, 0);
                }

                context.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);
                const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
                const data = imageData.data;
            
                let dynamicPixelCount = 0;

                for (let y = borderThickness; y < canvasElement.height - borderThickness; y++) {
                    for (let x = borderThickness; x < canvasElement.width - borderThickness; x++) {
                        const i = y * (canvasElement.width * 4) + x * 4;
                        const currentPixel = data[i];

                        if (currentPixel > 0.1) {
                            data[i] = silhouetteColor.r;
                            data[i + 1] = silhouetteColor.g;
                            data[i + 2] = silhouetteColor.b;
                            data[i + 3] = 255;

                            dynamicPixelCount++;

                            let isBorder = false;
                            for (let offsetY = -borderThickness; offsetY <= borderThickness && !isBorder; offsetY++) {
                                for (let offsetX = -borderThickness; offsetX <= borderThickness; offsetX++) {
                                    const neighbourI = (y + offsetY) * (canvasElement.width * 4) + (x + offsetX) * 4;
                                    if (data[neighbourI] <= 0.1) {
                                        isBorder = true;
                                        break;
                                    }
                                }
                            }

                            if (isBorder) {
                                data[i] = borderColor.r;
                                data[i + 1] = borderColor.g;
                                data[i + 2] = borderColor.b;
                            }
                        }
                    }
                }

                if (isCaptured && savedPixelCount && (dynamicPixelCount > savedPixelCount * 1.3 || dynamicPixelCount < savedPixelCount * 0.7)) {
                    console.log("바르게 앉으라");
                }

                // 동적 누끼 표시
                if (!isCaptured || savedData) {
                    context.putImageData(imageData, 0, 0);
                }
            };

            selfieSegmentation.onResults(onResults);

            const animate = async () => {
                await selfieSegmentation.send({ image: videoElement });
                requestAnimationFrame(animate);
            };

            navigator.mediaDevices.getUserMedia({ video: true })
                .then(async (stream) => {
                    videoElement.srcObject = stream;
                    try {
                        await videoElement.play();
                        animate();
                    } catch (err) {
                        console.error("Video play failed:", err);
                    }
                })
                .catch(error => {
                    console.error("Error accessing media devices.", error);
                });
        };

        return () => {
            if (videoElement && videoElement.srcObject) {
                videoElement.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [isCaptured, savedPixelCount, savedData]);

    const handleReadyClick = () => {
        setTimer(3);
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev === 1) {
                    clearInterval(interval);
                    captureSilhouette();
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <video ref={videoRef} playsInline style={{ position: 'absolute', zIndex: 1, width: '100%', maxWidth: '960px' }} />
            <canvas ref={canvasRef} style={{ position: 'absolute', zIndex: 2, width: '100%', maxWidth: '960px', opacity: 0.3 }} />
            {!isCaptured && 
                <button 
                    onClick={handleReadyClick} 
                    style={{ 
                        position: 'absolute', 
                        zIndex: 3, 
                        bottom: '10%', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        padding: '10px 20px',
                        fontSize: '20px',
                        backgroundColor: '#f00',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    {timer ? timer : 'Ready'}
                </button>
            }
        </div>
    );
}

export default ImageSegmentationComponent;
