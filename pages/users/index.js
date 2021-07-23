import { firebaseAdmin } from "../../FirebaseAdmin";
import nookies from "nookies";

export const getServerSideProps = async (context) => {

    try{

    const cookies = nookies.get(context);

    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    const { uid, email } = token;


    
    const db = firebaseAdmin.firestore(); 

    const usersRef = db.collection("Users");

    const listofUsers = [];

    await usersRef.get().then((snapchot) => {

        snapchot.forEach((doc) => {

            if(doc.exists) {
            console.log(doc.data().uid )

            listofUsers.push(doc.data().uid )

            }
        })
    })


      return {

        props: {  

            email,
             uid , 
             token, 
         }
      };
    } catch (err) {
      // either the `token` cookie didn't exist
      // or token verification failed
      // either way: redirect to the login page
      // either the `token` cookie didn't exist
      // or token verification failed
      // either way: redirect to the login page
      return {

        redirect: {
          permanent: false,
          destination: "/login"
        },  

        props: {} ,
      };
    }
  };


const UserProfile = (props) => {

return (
    
<div  >
 
<a >Most Visited</a>

 <a>Trending </a>   
</div>
    
)
    
}
    
export default UserProfile