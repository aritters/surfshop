import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();

export const onProductCreate = functions.firestore.document('Products/{productId}').onCreate(async (snapshot, context) => {
  try {
    const summarySnapshot = await admin.firestore().collection('ProductsSummary').limit(1).get();

    console.debug(`summary snapshot => `, summarySnapshot);

    if (summarySnapshot.empty) {
      console.log(`vai incluir`);
      await admin.firestore().collection('ProductsSummary').add({ count: 1 });

    } else {
      console.debug(`vai atualizar`);
      const id = summarySnapshot.docs[0].id;
      await admin.firestore().collection('ProductsSummary').doc(id).update({ count: admin.firestore.FieldValue.increment(1) });
    }

  } catch (error) {
    console.error(error);
  }
});

export const onProductDelete = functions.firestore.document('Products/{productId}').onDelete(async (snapshot, context) => {
  try {
    const summarySnapshot = await admin.firestore().collection('ProductsSummary').limit(1).get();

    if (summarySnapshot.empty) {
      await admin.firestore().collection('ProductsSummary').add({ count: 1 });

    } else {
      const id = summarySnapshot.docs[0].id;
      await admin.firestore().collection('ProductsSummary').doc(id).update({ count: admin.firestore.FieldValue.increment(-1) });
    }

  } catch (error) {
    console.error(error);
  }
});
