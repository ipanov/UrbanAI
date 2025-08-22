import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import Voice from '@react-native-voice/voice';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CreateIssueRequest, LocationData } from '../../UrbanAI.Shared/types';
import ApiService from '../services/ApiService';

const { width } = Dimensions.get('window');

interface IssueReportScreenProps {
  navigation: any;
}

const IssueReportScreen: React.FC<IssueReportScreenProps> = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  useEffect(() => {
    // Request location permission and get approximate location
    requestLocationPermission();
    
    // Setup voice recognition
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const requestLocationPermission = async () => {
    try {
      const permission = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
      if (permission !== RESULTS.GRANTED) {
        const result = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
        if (result === RESULTS.GRANTED) {
          getCurrentLocation(false); // Get non-precise location
        }
      } else {
        getCurrentLocation(false);
      }
    } catch (error) {
      console.warn('Location permission error:', error);
    }
  };

  const getCurrentLocation = (precise: boolean = false) => {
    const options = {
      enableHighAccuracy: precise,
      timeout: 15000,
      maximumAge: 10000,
    };

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({
          latitude: precise ? latitude : Math.round(latitude * 100) / 100, // Reduce precision
          longitude: precise ? longitude : Math.round(longitude * 100) / 100,
          accuracy,
        });
      },
      (error) => {
        console.warn('Location error:', error);
      },
      options
    );
  };

  const requestPreciseLocation = async () => {
    Alert.alert(
      'Precise Location',
      'Using precise location will help us suggest the exact address for faster reporting. Do you want to enable precise location?',
      [
        { text: 'No, keep approximate', style: 'cancel' },
        { 
          text: 'Yes, use precise',
          onPress: async () => {
            const permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (permission === RESULTS.GRANTED) {
              getCurrentLocation(true);
            }
          }
        }
      ]
    );
  };

  const selectPhoto = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: chooseFromGallery },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true,
      },
      handleImageResponse
    );
  };

  const chooseFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true,
      },
      handleImageResponse
    );
  };

  const handleImageResponse = (response: ImagePickerResponse) => {
    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];
      setPhotoUri(asset.uri || null);
      setPhotoBase64(asset.base64 || null);
      
      // If photo is taken and we have approximate location, offer precise location
      if (asset.uri && location && !location.accuracy) {
        requestPreciseLocation();
      }
    }
  };

  const startVoiceInput = async () => {
    try {
      const permission = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
      if (permission !== RESULTS.GRANTED) {
        const result = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (result !== RESULTS.GRANTED) {
          Alert.alert('Permission needed', 'Microphone permission is required for voice input');
          return;
        }
      }

      setIsRecording(true);
      await Voice.start('en-US');
    } catch (error) {
      console.error('Voice start error:', error);
      setIsRecording(false);
    }
  };

  const stopVoiceInput = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      console.error('Voice stop error:', error);
      setIsRecording(false);
    }
  };

  const onSpeechResults = (event: any) => {
    if (event.value && event.value.length > 0) {
      const spokenText = event.value[0];
      setDescription(prev => prev + (prev ? ' ' : '') + spokenText);
    }
  };

  const onSpeechError = (error: any) => {
    console.warn('Speech error:', error);
    setIsRecording(false);
  };

  const analyzeWithAI = async () => {
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please enter a description before analyzing');
      return;
    }

    setIsLoading(true);
    try {
      const result = await ApiService.analyzeIssueWithAI(description, photoBase64 || undefined);
      setAiSuggestion(result.analysisResult);
    } catch (error) {
      console.error('AI analysis error:', error);
      Alert.alert('Analysis Error', 'Could not analyze issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitIssue = async () => {
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Description is required to submit an issue');
      return;
    }

    setIsLoading(true);
    try {
      const issueData: CreateIssueRequest = {
        title: description.split(' ').slice(0, 5).join(' '), // First 5 words as title
        description,
        priority: 'medium',
        location: location || undefined,
        photoBase64: photoBase64 || undefined,
      };

      await ApiService.createIssue(issueData);
      Alert.alert('Success', 'Issue reported successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Report Municipal Issue</Text>
        
        {/* Photo Section */}
        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>Photo (Optional)</Text>
          {photoUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photoUri }} style={styles.photo} />
              <TouchableOpacity 
                style={styles.removePhotoBtn}
                onPress={() => {
                  setPhotoUri(null);
                  setPhotoBase64(null);
                }}
              >
                <Icon name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.photoPlaceholder} onPress={selectPhoto}>
              <Icon name="camera-alt" size={40} color="#667eea" />
              <Text style={styles.photoPlaceholderText}>Tap to add photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description (Required)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Describe the municipal issue in detail..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={[styles.voiceBtn, isRecording && styles.voiceBtnActive]}
              onPress={isRecording ? stopVoiceInput : startVoiceInput}
            >
              <Icon 
                name={isRecording ? "mic" : "mic-none"} 
                size={24} 
                color={isRecording ? "#ff4444" : "#667eea"} 
              />
            </TouchableOpacity>
          </View>
          {isRecording && (
            <Text style={styles.recordingText}>Recording... Tap microphone to stop</Text>
          )}
        </View>

        {/* Location Section */}
        {location && (
          <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationInfo}>
              <Icon name="location-on" size={16} color="#667eea" />
              <Text style={styles.locationText}>
                {location.accuracy > 100 ? 'Approximate location' : 'Precise location'} detected
              </Text>
            </View>
          </View>
        )}

        {/* AI Analysis Section */}
        {aiSuggestion && (
          <View style={styles.aiSection}>
            <Text style={styles.sectionTitle}>AI Analysis</Text>
            <Text style={styles.aiSuggestion}>{aiSuggestion}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.analyzeBtn}
            onPress={analyzeWithAI}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="psychology" size={20} color="#fff" />
                <Text style={styles.buttonText}>Analyze with AI</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.submitBtn}
            onPress={submitIssue}
            disabled={isLoading || !description.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="send" size={20} color="#fff" />
                <Text style={styles.buttonText}>Submit Issue</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  photoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  photoContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  photo: {
    width: width - 80,
    height: 200,
    borderRadius: 12,
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholder: {
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#667eea',
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    marginTop: 10,
    color: '#667eea',
    fontSize: 16,
    fontWeight: '500',
  },
  descriptionSection: {
    marginBottom: 30,
  },
  inputContainer: {
    position: 'relative',
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  voiceBtn: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceBtnActive: {
    backgroundColor: '#fff',
  },
  recordingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  locationSection: {
    marginBottom: 30,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 12,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  aiSection: {
    marginBottom: 30,
  },
  aiSuggestion: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 15,
  },
  analyzeBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  submitBtn: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default IssueReportScreen;