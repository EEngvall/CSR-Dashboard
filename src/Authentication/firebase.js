import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // Import the auth module

const firebaseConfig = {
  apiKey: 'AIzaSyBCzkoojF5-w8TKMHsS3m6IWPV4OYV1AFA',
  projectId: 'server-fadf1',
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Get a reference to the authentication service
const auth = firebase.auth();

export { auth }; // Export the auth object for use in your components
