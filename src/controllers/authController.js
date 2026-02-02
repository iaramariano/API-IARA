// src/controllers/authController.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase.js";

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        const user = userCredential.user;
        const token = await user.getIdToken();

        return res.status(200).json({
            mensagem: "Tá liberado",
            token: token,
        });

    } catch (error) {
        let mensagemErro = "F, tenta de novo";
        
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
            mensagemErro = "Email ou senha incorretos";
        } else if (error.code === 'auth/too-many-requests') {
            mensagemErro = "Muitas tentativas com e-mail e/ou senha inválidos. Tente novamente mais tarde.";
        }

        return res.status(401).json({ 
            error: mensagemErro,
            codigo: error.code 
        });
    }
};
