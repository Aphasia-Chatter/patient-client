import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import * as Speech from 'expo-speech';
import { Voice } from 'expo-speech/build/Speech.types';

const result = () => {
  const [ isPlaying, setIsPlaying ] = useState(false);
  
  // Specify the type of voices as an array of Voice
  const [voices, setVoices] = useState<Voice[]>([]);

  const displayAvailableVoices = async () => {
    try {
      const availableVoices = await Speech.getAvailableVoicesAsync();
      
      // Filter voices based on language and ID conditions
      const filteredVoices = availableVoices.filter(
        (voice) =>
          voice.language.startsWith('en-') &&
          voice.identifier.startsWith('com.apple.voice.compact')
      );

      // Log the filtered voices to the console with numbering
      filteredVoices.forEach((voice, index) => {
        console.log(`${index + 1}: ID - ${voice.identifier}, Name - ${voice.name}, Language - ${voice.language}, Quality- ${voice.quality}`);
      });

      // Optionally update the state with filtered voices
      setVoices(filteredVoices);
    } catch (error) {
      console.error('Error fetching voices:', error);
    }
  };

  useEffect(() => {
    // Clear speech in the queue
    Speech.stop();
    // displayAvailableVoices();
  }, []);

  const speak = () => {
    const thingToSay = 'Congratulations! You have pressed me.';
    Speech.speak(thingToSay, {
      rate:0.7,
      pitch:1,
      voice:"com.apple.voice.compact.en-US.Samantha",
      onStart:() => setIsPlaying(true), 
      onPause:() => setIsPlaying(false), 
      onResume:() => setIsPlaying(true),
      onDone:() => setIsPlaying(false),
      onStopped:() => setIsPlaying(false),
      onError: () => setIsPlaying(false)
    });
  };


  return (
    <View className='flex-1 flex justify-center items-center space-y-6 bg-light dark:bg-dark'>
      <Text className='mx-4 text-justify text-dark dark:text-light'>
        TODO
      </Text>
      <Button title="Press to hear some words"
        onPress={() => {
          if (isPlaying) {
            // Interrupts current speech and deletes all in queue. playing the TTS
            setIsPlaying(false);
            Speech.stop();
          } else {
            // Call the speak function when isPlaying is false
            speak();
          }
        }}
      />
    </View>
  );
}

export default result