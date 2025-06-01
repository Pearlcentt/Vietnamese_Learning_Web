/**
 * FPT.AI TTS API Utility
 * Provides text-to-speech functionality for Vietnamese Learning Web application
 */

const TTS = {
    // FPT.AI API configuration
    API_KEY: "mpNlGxwzJLYQegaUVHJtTWfSwSU1Vfeu",
    API_URL: "https://api.fpt.ai/hmi/tts/v5",
    VOICE: "banmai",
    
    /**
     * Convert text to speech using FPT.AI TTS API
     * @param {string} text - The Vietnamese text to convert to speech
     * @param {function} onSuccess - Callback function called when audio plays successfully
     * @param {function} onError - Callback function called when an error occurs
     */
    async speak(text, onSuccess = null, onError = null) {
        try {
            console.log("Converting text to speech:", text);
            
            const response = await fetch(this.API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": this.API_KEY,
                    "voice": this.VOICE,
                },
                body: JSON.stringify({ text: text }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} - ${response.statusText}`);
            }

            const responseData = await response.json();
            console.log("TTS API Response:", responseData);

            if (responseData && responseData.async) {
                const audioUrl = responseData.async;

                // Wait for the audio file to be processed
                setTimeout(() => {
                    const audio = new Audio(audioUrl);
                    
                    audio.oncanplaythrough = () => {
                        console.log("Audio loaded and playing successfully");
                        audio.play();
                        if (onSuccess) onSuccess();
                    };
                    
                    audio.onerror = (err) => {
                        console.error("Error loading audio:", err);
                        if (onError) onError(err);
                    };
                    
                    audio.onended = () => {
                        console.log("Audio playback completed");
                    };
                    
                }, 2000); // Wait 2 seconds for the audio file to be processed
                
            } else {
                throw new Error("No audio URL found in response");
            }
            
        } catch (error) {
            console.error("TTS Error:", error);
            if (onError) onError(error);
        }
    },

    /**
     * Add click event listener to a speaker element
     * @param {string|HTMLElement} speakerElement - Speaker element ID or DOM element
     * @param {string} text - Text to speak when clicked
     */
    addSpeakerListener(speakerElement, text) {
        const element = typeof speakerElement === 'string' 
            ? document.getElementById(speakerElement) 
            : speakerElement;
            
        if (element) {
            element.addEventListener("click", () => {
                this.speak(text);
            });
            
            // Add visual feedback
            element.style.cursor = "pointer";
            element.addEventListener("mouseenter", () => {
                element.style.opacity = "0.8";
            });
            element.addEventListener("mouseleave", () => {
                element.style.opacity = "1";
            });
        } else {
            console.warn("Speaker element not found:", speakerElement);
        }
    }
};

// Make TTS available globally
window.TTS = TTS;
