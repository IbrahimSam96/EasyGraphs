import React from "react";
import nookies from "nookies";
import { firebaseAdmin } from "../../FirebaseAdmin";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
export const getServerSideProps = async (context) => {
    try {
        const cookies = nookies.get(context);
        console.log(JSON.stringify(cookies, null, 2));

        const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
        const { uid, email } = token;

        const db = firebaseAdmin.firestore();

        const numberofdashboards = db.collection("Users").doc(uid).collection("Dashboard")

        const dashboards = []

        await numberofdashboards.get().then((snapshot) => {

            snapshot.forEach((doc) => {

                console.log(doc.id)

                dashboards.push(doc.id)

            });

        });

        console.log(dashboards.length)

        const latestDashboard = db.collection("Users").doc(uid).collection("Dashboard").orderBy('date', 'desc').limit(1)

        const docID = []

        if (dashboards.length < 5) {

            await db.collection("Users").doc(uid).collection("Dashboard").add({
                date: new Date,
                views: 0
            })
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });


            await latestDashboard.get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    console.log(doc.id)
                    docID.push(doc.id)

                });
            });

            return {

                redirect: {
                    destination: `create/${docID[0]}`,
                    permanent: false,
                },
                props: {
                    email, uid, token
                }
            }

        }


        // the user is authenticated!
        // FETCH STUFF HERE

        return {
            props: { email, uid, token, dashboards },


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
            props: {

            },
        };
    }
};



const Create = (props) => {

    console.log(props.dashboards)

    return (
<div className="ExceededPage ">

        <div className="MaximumDashboards" >

            <span> Sorry you have exceded the limit of {props.dashboards.length} dashboards. </span>

            <span> Create a new account or Upgrade to a premium account. </span>

            <span> <a href={`/users/${props.uid}`}> <KeyboardBackspaceIcon style={{fontSize:"2.5rem"}}/> </a> </span>


        </div>
        </div>
    )
}

export default Create;