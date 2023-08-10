import React, { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const API_KEY = 'AIzaSyCNTWbM6BWxnN44DljLSoBhwYWFND0Ua2Y'; // Perspective API Key

const AudioSegmentationComponent = () => {
    const [audioStream, setAudioStream] = useState(null);
    const [toxicityDetected, setToxicityDetected] = useState(false); // New state to track if toxicity was detected
    const audioContextRef = useRef(null);
    const { transcript,  listening } = useSpeechRecognition();


    useEffect(() => {
        console.log(transcript);
        if (transcript) {
            // Perspective API 요청
            axios.post(
              'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze',
              {
                comment: { text: transcript },
                requestedAttributes: { TOXICITY: {}, SEVERE_TOXICITY: {} },
              },
              {
                params: { key: API_KEY },
              }
            )
            .then((response) => {
              const toxicityScore = response.data.attributeScores.TOXICITY.summaryScore.value;
              const severeToxicityScore = response.data.attributeScores.SEVERE_TOXICITY.summaryScore.value;
              console.log(toxicityScore);
              if (toxicityScore >= 0.7 || severeToxicityScore >= 0.7) {
                console.log('욕설이나 논란스러운 내용이 감지되었습니다.');
                if (!toxicityDetected) {
                  setToxicityDetected(true); // Set toxicityDetected to true when toxicity is detected
                }
              }
            })
            .catch((error) => {
              console.error('Perspective API 요청 중 오류가 발생했습니다:', error);
            });}


        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                setAudioStream(stream);
                audioContextRef.current = new AudioContext();

                if (!listening) {
                    SpeechRecognition.startListening();
                }
            })
            .catch(error => {
                console.error("Error accessing audio devices.", error);
            });

        return () => {
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
            }
        };
    // eslint-disable-next-line
    }, [listening]);

    return (
        <>
        </>
    );
}

export default AudioSegmentationComponent;
