import jwt from 'jsonwebtoken';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase.js";

const JWT_SECRET = process.env.JWT_SECRET || 'bearer_token';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        const meuToken = jwt.sign(
            { 
                uid: firebaseUser.uid,
                email: firebaseUser.email 
            },
            JWT_SECRET,
            { expiresIn: '7d' } 
        );

        return res.status(200).json({
            mensagem: "Tá liberado",
            token: meuToken, 
        });

    } catch (error) {
        return res.status(401).json({ error: "Ixi tem algo errado" });
    }
};
