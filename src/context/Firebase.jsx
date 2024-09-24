import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes ,getDownloadURL,deleteObject} from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: "AIzaSyD7P79hw0-o22643k1qYknkpYoB1wKOvT0",
  authDomain: "bookloom.firebaseapp.com",
  projectId: "bookloom",
  storageBucket: "bookloom.appspot.com",
  messagingSenderId: "81714507471",
  appId: "1:81714507471:web:2e49c6186db98ba90c11ba"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);


export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signupUserWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing up:", error.message);
      throw error;
    }
  };

  const signinUserWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in:", error.message);
      throw error;
    }
  };

  const signinWithGoogle = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      throw error;
    }
  };

  const handleCreateNewListing = async (Name, ISBNno, price, coverPic) => {
    try {
      const imageRef = ref(storage, `uploads/images/${Date.now()}-${coverPic.name}`);
      const uploadResult = await uploadBytes(imageRef, coverPic);
      const imageURL = await getDownloadURL(uploadResult.ref);
  
      return await addDoc(collection(firestore, 'books'), {
        Name,
        ISBNno,
        price,
        imageURL,
        userID: user.uid,
        userEmail: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    } catch (error) {
      console.error("Error uploading image and creating listing:", error);
      throw error;
    }
  };
  

  const listAllBooks = () => {
    return getDocs(collection(firestore, "books"));
  }
  const getImageURL=(path)=>{
    return getDownloadURL(ref(storage,path));
  };
  const desertRef = ref(storage, 'uploads/images/1720370136107-cover 3.png');
  deleteObject(desertRef).then(() => {
    // File deleted successfully
  }).catch((error) => {
    // Uh-oh, an error occurred!
  });
  

  const isLoggedIn = !!user;

  return (
    <FirebaseContext.Provider value={{ 
      signupUserWithEmailAndPassword, 
      signinUserWithEmailAndPassword, 
      signinWithGoogle, 
      isLoggedIn, 
      loading, 
      user, 
      handleCreateNewListing,
      listAllBooks,
      getImageURL
    }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};
