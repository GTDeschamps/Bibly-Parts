/*
  This module centralizes all Firebase calls for your Partitions collection,
  replacing local storage. It uses Firestore for secure, efficient data access.
*/

import { db, auth } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

// Référence vers la collection des partitions
const partitionsCollection = collection(db, "Partitions");

export { db, auth };

/**
 * Fetch all partitions from Firestore
 */
export async function fetchPartitions() {
  const snapshot = await getDocs(partitionsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Fetch a single partition by ID
 */
export async function fetchPartitionById(id: string) {
  const ref = doc(db, "partitions", id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) throw new Error("Partition not found");
  return { id: snapshot.id, ...snapshot.data() };
}

/**
 * Create a new partition
 */
export async function createPartition(data: Record<string, any>) {
  const docRef = await addDoc(partitionsCollection, data);
  return docRef.id;
}

/**
 * Update existing partition
 */
export async function updatePartition(id: string, data: Record<string, any>) {
  const ref = doc(db, "partitions", id);
  await updateDoc(ref, data);
}

/**
 * Delete a partition
 */
export async function deletePartition(id: string) {
  const ref = doc(db, "partitions", id);
  await deleteDoc(ref);
}

/**
 * Récupère les favoris d'un utilisateur
 */
export async function fetchFavorites(userId: string) {
  const favRef = collection(db, `users/${userId}/favorites`);
  const snapshot = await getDocs(favRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
/**
 *
 * récupère le panier d'un utilisateur
 */
export async function fetchCart(userId: string) {
  const cartRef = collection(db, `users/${userId}/cart`);
  const snapshot = await getDocs(cartRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
